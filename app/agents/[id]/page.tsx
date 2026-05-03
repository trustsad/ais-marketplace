import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllAgents, getAgentById, computeRating } from '@/lib/agents';
import ChatPlayground from '@/components/ChatPlayground';
import EnquiryForm from '@/components/EnquiryForm';
import ScrollToTop from '@/components/ScrollToTop';

export async function generateStaticParams() {
  const agents = getAllAgents();
  return agents.map(a => ({ id: a.id }));
}

const industryColors: Record<string, { bg: string; color: string }> = {
  'Food & Beverage': { bg: '#E1F5EE', color: '#0F6E56' },
  'Life Sciences':   { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = getAgentById(params.id);
  if (!agent) notFound();

  const rating = computeRating(agent);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#f0efe9', minHeight: '100vh', color: '#1a1a1a',
    }}>
      <ScrollToTop />
      {/* Top bar */}
      <div style={{
        background: '#1e1e1e', borderBottom: '1px solid #2e2e2e',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#fff' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
          </div>
          AIS Marketplace
        </div>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
          ← Back to marketplace
        </Link>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div style={{
          background: '#fff', border: '1px solid #e2e0d8', borderRadius: '16px',
          padding: '28px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px', background: agent.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '30px', flexShrink: 0,
            }}>
              {agent.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>{agent.name}</h1>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '12px', fontWeight: 500,
                  color: agent.status === 'live' ? '#1D9E75' : '#aaa',
                }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: agent.status === 'live' ? '#1D9E75' : '#ccc' }} />
                  {agent.status === 'live' ? 'Live' : 'Coming soon'}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#555', margin: '0 0 12px' }}>{agent.tagline}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {agent.industry.map(ind => {
                  const c = industryColors[ind] ?? { bg: '#f0f0f0', color: '#555' };
                  return (
                    <span key={ind} style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: c.bg, color: c.color, fontWeight: 600 }}>
                      {ind}
                    </span>
                  );
                })}
                <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', background: '#f5f4ef', color: '#555', border: '1px solid #e2e0d8' }}>
                  {agent.function}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {agent.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: '#f5f4ef', color: '#555', border: '1px solid #e2e0d8' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', color: '#BA7517' }}>
                {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
                <span style={{ color: '#888', fontSize: '12px', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Used by {agent.usageCount}+ teams</div>
              {agent.docsUrl && (
                <a href={agent.docsUrl} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: '12px', padding: '6px 14px', borderRadius: '7px',
                  border: '1px solid #d8d6ce', background: '#fff', color: '#555',
                  textDecoration: 'none',
                }}>
                  View docs ↗
                </a>
              )}
              <a href="#enquiry" style={{
                fontSize: '12px', padding: '6px 14px', borderRadius: '7px',
                border: 'none', background: '#7F77DD', color: '#fff',
                textDecoration: 'none',
              }}>
                Get in touch
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: '#fff', border: '1px solid #e2e0d8', borderRadius: '14px',
          padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>About this agent</h2>
          <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.7, margin: 0 }}>{agent.description}</p>
        </div>

        {/* Video */}
        <div style={{
          background: '#fff', border: '1px solid #e2e0d8', borderRadius: '14px',
          padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>Watch a demo</h2>
          {agent.videoUrl ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '10px', overflow: 'hidden' }}>
              <iframe
                src={agent.videoUrl}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{
              height: '200px', background: '#f5f4ef', border: '1.5px dashed #d0cec7',
              borderRadius: '10px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <div style={{ fontSize: '32px' }}>🎬</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Demo video coming soon</div>
            </div>
          )}
        </div>

        {/* Chat playground */}
        <div id="try-it" style={{
          background: '#fff', border: '1px solid #e2e0d8', borderRadius: '14px',
          padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: '#1a1a1a' }}>
            Try {agent.name}
          </h2>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px' }}>
            Live sandbox — connect your own BC environment to see real data.
          </p>
          <ChatPlayground
            agentId={agent.id}
            agentName={agent.name}
            agentEmoji={agent.emoji}
            isLive={agent.status === 'live' && agent.flowId !== 'placeholder' && agent.flowId !== ''}
          />
        </div>

        {/* Reviews */}
        {agent.reviews && agent.reviews.length > 0 && (
          <div style={{
            background: '#fff', border: '1px solid #e2e0d8', borderRadius: '14px',
            padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
              Reviews
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {agent.reviews.map((r, i) => (
                <div key={i} style={{
                  padding: '14px 16px', background: '#fafaf8', borderRadius: '10px',
                  border: '1px solid #e2e0d8',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>{r.author}</span>
                    <span style={{ fontSize: '12px', color: '#BA7517' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#444', margin: 0, lineHeight: 1.55 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enquiry form */}
        <div
          id="enquiry"
          style={{
            background: '#fff', border: '1px solid #e2e0d8', borderRadius: '14px',
            padding: '24px', marginBottom: '40px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px', color: '#1a1a1a' }}>
            Interested in {agent.name}?
          </h2>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '18px' }}>
            Get in touch and our team will set you up.
          </p>
          <EnquiryForm defaultAgents={[agent.name]} />
        </div>

      </div>
    </div>
  );
}
