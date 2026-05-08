import { notFound } from 'next/navigation';
import { getAllAgents, getAgentById } from '@/lib/agents';
import EmbedChat from '@/components/EmbedChat';

export async function generateStaticParams() {
  return getAllAgents().map(a => ({ id: a.id }));
}

export default function EmbedPage({ params }: { params: { id: string } }) {
  const agent = getAgentById(params.id);
  if (!agent) notFound();

  return (
    <EmbedChat
      agentId={agent.id}
      flowId={agent.flowId}
      agentName={agent.name}
      agentEmoji={agent.emoji}
      isLive={agent.status === 'live' && !!agent.flowId && agent.flowId !== 'placeholder'}
    />
  );
}
