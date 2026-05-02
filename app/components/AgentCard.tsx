type IndustryBadge = {
  label: string;
  bg: string;
  color: string;
}

type AgentCardProps = {
  emoji: string;
  iconBg: string;
  title: string;
  description: string;
  industry?: IndustryBadge;
  stars?: number;
  featured?: boolean;
  status?: 'live' | 'coming-soon';
}

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ fontSize: '11px', color: '#BA7517' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

export default function AgentCard({ emoji, iconBg, title, description, industry, stars, featured, status }: AgentCardProps) {
  return (
    <div style={{
      background: '#fff',
      border: featured ? '2px solid #7F77DD' : '1px solid #e2e0d8',
      borderRadius: '12px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      boxShadow: featured ? '0 2px 8px rgba(127,119,221,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      {featured && (
        <span style={{
          fontSize: '10px', background: '#EEEDFE', color: '#534AB7',
          padding: '2px 8px', borderRadius: '6px', fontWeight: 600, alignSelf: 'flex-start',
        }}>
          Featured
        </span>
      )}
      <div style={{
        width: '36px', height: '36px', borderRadius: '9px', background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
      }}>
        {emoji}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#666', lineHeight: 1.5, flex: 1 }}>{description}</div>
      {(industry || stars !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {industry && (
            <span style={{
              fontSize: '10px', background: industry.bg, color: industry.color,
              padding: '2px 7px', borderRadius: '6px', fontWeight: 600,
            }}>
              {industry.label}
            </span>
          )}
          {stars !== undefined && <StarRating count={stars} />}
        </div>
      )}
      {status === 'coming-soon' ? (
        <div style={{
          fontSize: '11px', padding: '6px 0', borderRadius: '7px',
          border: '1px solid #e2e0d8', color: '#aaa',
          textAlign: 'center', background: '#fafaf8',
        }}>
          Coming soon
        </div>
      ) : (
        <button style={{
          fontSize: '11px', padding: '6px 0', borderRadius: '7px',
          border: 'none', background: '#7F77DD', color: '#fff',
          cursor: 'pointer', fontWeight: 600, width: '100%',
        }}>
          Try it
        </button>
      )}
    </div>
  );
}
