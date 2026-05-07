import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';

// Extend Vercel function timeout to 5 minutes (Pro plan max)
export const maxDuration = 300;

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
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  if (!agent.flowId || agent.flowId === 'placeholder') {
    return NextResponse.json({ error: 'Agent not yet live' }, { status: 422 });
  }

  const apiKey = process.env.INTELLIGENCE_STUDIO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const baseUrl = process.env.INTELLIGENCE_STUDIO_BASE_URL ?? 'https://appcentral-demo.aptean.com';

  // Get IAM service token
  let serviceToken: string;
  try {
    serviceToken = await getServiceToken(baseUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('IAM error:', msg);
    return NextResponse.json({ error: `Auth error: ${msg}` }, { status: 500 });
  }

  const url = `${baseUrl}/ais/api/v1/run/${agent.flowId}?stream=false`;

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
    return NextResponse.json(
      { error: `Upstream error (${upstream.status})`, detail: body },
      { status: upstream.status }
    );
  }

  const data = await upstream.json();

  // Langflow response shape: outputs[0].outputs[0].results.message.text
  const text: string =
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
    data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ??
    JSON.stringify(data);

  return NextResponse.json({ text });
}
