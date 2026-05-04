import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';

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
  const url = `${baseUrl}/ais/api/v1/run/${agent.flowId}?stream=false`;

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      output_type: 'chat',
      input_type: 'chat',
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
