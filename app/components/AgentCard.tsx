'use client';

import Link from 'next/link';
import { BookmarkPlus, BookmarkCheck, Play, BookOpen, Clock } from 'lucide-react';
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

const productLineColors: Record<string, { bg: string; color: string }> = {
  'Business Central':           { bg: '#EBF4FF', color: '#0078D4' },
  'JustFoodERP':                { bg: '#ECFDF5', color: '#1D9E75' },
  'bcFood':                     { bg: '#ECFDF5', color: '#2BAE80' },
  'Food & Beverage':            { bg: '#ECFDF5', color: '#3DBE6E' },
  'Apparel':                    { bg: '#FDF2F8', color: '#C0397A' },
  'Equipment':                  { bg: '#FFFBEB', color: '#D97706' },
  'Travers':                    { bg: '#F5F3FF', color: '#7C3AED' },
  'Traverse Global':            { bg: '#EDE9FE', color: '#6D28D9' },
  'Made2Manage':                { bg: '#FFFBEB', color: '#B45309' },
  'M2M':                        { bg: '#FFFBEB', color: '#B45309' },
  'ProcessPro':                 { bg: '#EFF6FF', color: '#0369A1' },
  'Ross':                       { bg: '#FEF2F2', color: '#DC2626' },
  'Mistral ERP':                { bg: '#FAF5FF', color: '#9333EA' },
  'oxaion ERP':                 { bg: '#ECFEFF', color: '#0891B2' },
  'Apparel Next Gen':           { bg: '#FDF2F8', color: '#DB2777' },
  'Aptean Food & Beverage ERP': { bg: '#F0FDF4', color: '#15803D' },
  'Equipment DMS':              { bg: '#FFFBEB', color: '#D97706' },
  'Equipsoft':                  { bg: '#FEF3C7', color: '#B45309' },
  'Lascom PLM':                 { bg: '#E0F2FE', color: '#0284C7' },
  'Logility - DAI+':            { bg: '#F5F3FF', color: '#7C3AED' },
  'TLX':                        { bg: '#ECFDF5', color: '#059669' },
  'Intuitive':                  { bg: '#ECFEFF', color: '#0891B2' },
  'Paragon':                    { bg: '#EEF2FF', color: '#6366F1' },
  'rs2':                        { bg: '#ECFEFF', color: '#0891B2' },
  'Southware':                  { bg: '#FFFBEB', color: '#D97706' },
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

      {/* Industry badges + product line + rating */}
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
          {agent.productLine && (() => {
            const pc = productLineColors[agent.productLine] ?? { bg: '#F3F4F6', color: '#555' };
            return (
              <span style={{
                fontSize: '10px', padding: '2px 7px', borderRadius: '6px',
                background: pc.bg, color: pc.color, fontWeight: 600,
              }}>
                {agent.productLine}
              </span>
            );
          })()}
        </div>
        {reviewCount > 0 && <StarRating rating={rating} count={reviewCount} />}
      </div>

      {/* Usage count */}
      <div style={{ fontSize: '11px', color: '#aaa' }}>
        Used by {agent.usageCount}+ teams
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginTop: 'auto' }}>

        {/* Row 1: Try it (full width) */}
        {agent.status === 'live' ? (
          <Link href={`/agents/${agent.id}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '9px 0', borderRadius: '8px', background: '#7F77DD',
            color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
          }}>
            <Play size={13} fill="currentColor" />
            Try It
          </Link>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '9px 0', borderRadius: '8px', background: '#f5f4ef',
            color: '#aaa', fontSize: '12px', fontWeight: 600, border: '1px solid #e2e0d8',
          }}>
            <Clock size={13} />
            Coming Soon
          </div>
        )}

        {/* Row 2: Shortlist + Learn More */}
        <div style={{ display: 'flex', gap: '7px' }}>
          <button
            onClick={() => inCart ? removeItem(agent.id) : addItem({ id: agent.id, name: agent.name })}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
              padding: '7px 0', borderRadius: '8px', border: '1px solid',
              borderColor: inCart ? '#7F77DD' : '#d8d6ce',
              background: inCart ? '#EEEDFE' : '#fff',
              color: inCart ? '#7F77DD' : '#666',
              fontSize: '11px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {inCart
              ? <><BookmarkCheck size={12} /> Shortlisted</>
              : <><BookmarkPlus size={12} /> Shortlist</>}
          </button>

          <Link href={`/agents/${agent.id}`} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            padding: '7px 0', borderRadius: '8px', border: '1px solid #d8d6ce',
            background: '#fff', color: '#666', fontSize: '11px', fontWeight: 600,
            textDecoration: 'none',
          }}>
            <BookOpen size={12} />
            Learn More
          </Link>
        </div>

      </div>
    </div>
  );
}
