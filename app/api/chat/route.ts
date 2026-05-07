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

  // Pipe AIS SSE stream → client SSE stream
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let hasChunks = false;

      const emit = (obj: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      const tryExtractChunk = (parsed: Record<string, unknown>): string | null =>
        (parsed?.chunk as string) ??
        (parsed?.text  as string) ??
        null;

      // If the whole response arrives as one non-streaming JSON blob, extract text
      const tryExtractFull = (parsed: Record<string, unknown>): string | null => {
        const outputs = parsed?.outputs as Array<{ outputs: Array<{ results?: { message?: { text?: string } }, artifacts?: { message?: string } }> }> | undefined;
        return (
          outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
          outputs?.[0]?.outputs?.[0]?.artifacts?.message ??
          null
        );
      };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') continue;

            try {
              const parsed = JSON.parse(raw) as Record<string, unknown>;
              const chunk = tryExtractChunk(parsed);
              if (chunk) {
                hasChunks = true;
                emit({ chunk });
              }
            } catch { /* non-JSON line — skip */ }
          }
        }

        // Flush remaining buffer
        if (buffer.startsWith('data: ')) {
          const raw = buffer.slice(6).trim();
          if (raw && raw !== '[DONE]') {
            try {
              const parsed = JSON.parse(raw) as Record<string, unknown>;
              const chunk = tryExtractChunk(parsed);
              if (chunk) { hasChunks = true; emit({ chunk }); }

              // Fallback: non-streaming full response arrived as one blob
              if (!hasChunks) {
                const full = tryExtractFull(parsed);
                if (full) emit({ chunk: full });
              }
            } catch { /* skip */ }
          }
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
