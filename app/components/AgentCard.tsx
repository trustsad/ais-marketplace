'use client';

import Link from 'next/link';
import { useCart } from './CartContext';
import type { Agent } from '@/lib/agents';

function computeRating(agent: Agent): number {
  if (!agent.reviews || agent.reviews.length === 0) return agent.rating;
  return agent.reviews.reduce((acc, r) => acc + r.stars, 0) / agent.reviews.length;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const filled = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontSize: '12px', color: '#BA7517', letterSpacing: '1px' }}>
        {'★'.repeat(filled)}{'☆'.repeat(5 - filled)}
      </span>
      <span style={{ fontSize: '11px', color: '#999' }}>
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

const industryColors: Record<string, { bg: string; color: string }> = {
  'Food & Beverage': { bg: '#E1F5EE', color: '#0F6E56' },
  'Life Sciences':   { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AgentCard({ agent }: { agent: Agent }) {
  const { isInCart, addItem, removeItem } = useCart();
  const inCart = isInCart(agent.id);
  const rating = computeRating(agent);
  const reviewCount = agent.reviews?.length ?? 0;

  return (
    <div style={{
      background: '#fff',
      border: agent.featured ? '2px solid #7F77DD' : '1px solid #e2e0d8',
      borderRadius: '14px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: agent.featured
        ? '0 2px 12px rgba(127,119,221,0.18)'
        : '0 1px 4px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Top row: icon + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', background: agent.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          flexShrink: 0,
        }}>
          {agent.emoji}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          {agent.featured && (
            <span style={{
              fontSize: '10px', background: '#EEEDFE', color: '#534AB7',
              padding: '2px 8px', borderRadius: '6px', fontWeight: 600,
            }}>
              Featured
            </span>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '11px', fontWeight: 500,
            color: agent.status === 'live' ? '#1D9E75' : '#aaa',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: agent.status === 'live' ? '#1D9E75' : '#ccc',
            }} />
            {agent.status === 'live' ? 'Live' : 'Coming soon'}
          </div>
        </div>
      </div>

      {/* Name + tagline */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
          {agent.name}
        </div>
        <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.55 }}>
          {agent.tagline}
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {agent.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
            background: '#f5f4ef', color: '#555', border: '1px solid #e2e0d8',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Industry badges + rating */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {agent.industry.map(ind => {
            const c = industryColors[ind] ?? { bg: '#f0f0f0', color: '#555' };
            return (
              <span key={ind} style={{
                fontSize: '10px', padding: '2px 7px', borderRadius: '6px',
                background: c.bg, color: c.color, fontWeight: 600,
              }}>
                {ind === 'Food & Beverage' ? 'F&B' : ind}
              </span>
            );
          })}
        </div>
        {reviewCount > 0 && <StarRating rating={rating} count={reviewCount} />}
      </div>

      {/* Usage count */}
      <div style={{ fontSize: '11px', color: '#aaa' }}>
        Used by {agent.usageCount}+ teams
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '7px' }}>
          {agent.status === 'live' ? (
            <Link href={`/agents/${agent.id}`} style={{
              flex: 1, padding: '9px 0', borderRadius: '8px',
              background: '#7F77DD', color: '#fff', fontSize: '12px',
              fontWeight: 600, textAlign: 'center', textDecoration: 'none',
              display: 'block',
            }}>
              Try it →
            </Link>
          ) : (
            <div style={{
              flex: 1, padding: '9px 0', borderRadius: '8px',
              background: '#f5f4ef', color: '#aaa', fontSize: '12px',
              fontWeight: 600, textAlign: 'center', border: '1px solid #e2e0d8',
            }}>
              Coming soon
            </div>
          )}

          <button
            onClick={() => inCart ? removeItem(agent.id) : addItem({ id: agent.id, name: agent.name })}
            title={inCart ? 'Remove from enquiry' : 'Add to enquiry'}
            style={{
              width: '38px', height: '38px', borderRadius: '8px', border: '1px solid',
              borderColor: inCart ? '#7F77DD' : '#d8d6ce',
              background: inCart ? '#EEEDFE' : '#fff',
              color: inCart ? '#7F77DD' : '#888',
              cursor: 'pointer', fontSize: '16px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {inCart ? '✓' : '+'}
          </button>
        </div>

        <Link href={`/agents/${agent.id}`} style={{
          padding: '7px 0', borderRadius: '8px', border: '1px solid #d8d6ce',
          background: '#fff', color: '#555', fontSize: '12px',
          textAlign: 'center', textDecoration: 'none', display: 'block',
        }}>
          Learn more
        </Link>
      </div>
    </div>
  );
}
