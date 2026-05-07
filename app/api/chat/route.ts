import { NextRequest } from 'next/server';
import { getAgentById } from '@/lib/agents';

// Extend Vercel function timeout to 5 minutes (Pro plan max)
export const maxDuration = 300;

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

async function getServiceToken(baseUrl: string): Promise<string> {
  const clientId     = process.env.IAM_CLIENT_ID;
  const clientSecret = process.env.IAM_CLIENT_SECRET;
  const realm        = process.env.IAM_REALM ?? 'aptean-demo';

  if (!clientId || !clientSecret) {
    throw new Error('IAM credentials not configured');
  }

  const iamUrl = `${baseUrl}/iam/auth/realms/${realm}/protocol/openid-connect/token`;

  const res = await fetch(iamUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      grant_type:    'client_credentials',
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`IAM token fetch failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error('No access_token in IAM response');
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  const { agentId, message } = await req.json();

  const agent = getAgentById(agentId);
  if (!agent) return json({ error: 'Agent not found' }, 404);

  if (!agent.flowId || agent.flowId === 'placeholder') {
    return json({ error: 'Agent not yet live' }, 422);
  }

  const apiKey = process.env.INTELLIGENCE_STUDIO_API_KEY;
  if (!apiKey) return json({ error: 'API key not configured' }, 500);

  const baseUrl = process.env.INTELLIGENCE_STUDIO_BASE_URL ?? 'https://appcentral-demo.aptean.com';

  // Get IAM service token
  let serviceToken: string;
  try {
    serviceToken = await getServiceToken(baseUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('IAM error:', msg);
    return json({ error: `Auth error: ${msg}` }, 500);
  }

  const url = `${baseUrl}/ais/api/v1/run/${agent.flowId}?stream=true`;

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-api-key':     apiKey,
      'Authorization': `Bearer ${serviceToken}`,
    },
    body: JSON.stringify({
      output_type: 'chat',
      input_type:  'chat',
      input_value: message,
    }),
  });

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => '');
    console.error(`Upstream error ${upstream.status} for flowId ${agent.flowId}:`, body);
    return json({ error: `Upstream error (${upstream.status})`, detail: body }, upstream.status);
  }

  // AIS returns application/x-ndjson — each line is a raw JSON event object:
  //   {"event": "session"|"heartbeat"|"add_message"|"end", "data": {...}}
  // The final text lives in the "end" event at:
  //   data.result.outputs[0].outputs[0].results.message.data.text
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const emit = (obj: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      // Extract the response text from any known AIS event shape
      type AisEvent = { event: string; data: Record<string, unknown> };

      const extractText = (ev: AisEvent): string | null => {
        const d = ev.data;

        // "end" event: data.result.outputs[0].outputs[0].results.message.data.text
        if (ev.event === 'end' && d?.result) {
          const result = d.result as Record<string, unknown>;
          const outputs = result?.outputs as Array<{ outputs: Array<{ results?: { message?: { data?: { text?: string }; text?: string } }; artifacts?: { message?: string } }> }> | undefined;
          return (
            outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text ??
            outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
            outputs?.[0]?.outputs?.[0]?.artifacts?.message ??
            null
          );
        }

        // "add_message" event from Machine with non-empty text (final AI message)
        if (ev.event === 'add_message' && (d?.sender === 'Machine' || d?.sender_name === 'AI')) {
          const text = d?.text as string | undefined;
          if (text) return text;
        }

        return null;
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            try {
              const ev = JSON.parse(trimmed) as AisEvent;
              const text = extractText(ev);
              if (text) emit({ chunk: text });
            } catch { /* skip malformed lines */ }
          }
        }

        // Flush remaining buffer
        const trimmed = buffer.trim();
        if (trimmed) {
          try {
            const ev = JSON.parse(trimmed) as AisEvent;
            const text = extractText(ev);
            if (text) emit({ chunk: text });
          } catch { /* skip */ }
        }

        emit({ done: true });
      } catch (err) {
        emit({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
