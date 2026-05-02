type AgentRowProps = {
  emoji: string;
  iconBg: string;
  title: string;
  description: string;
  tags: string[];
  status: 'live' | 'coming-soon';
}

export default function AgentRow({ emoji, iconBg, title, description, tags, status }: AgentRowProps) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e0d8', borderRadius: '12px',
      padding: '14px 16px', marginBottom: '10px', display: 'flex',
      gap: '14px', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: '42px', height: '42px', borderRadius: '10px', background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: '20px',
      }}>
        {emoji}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '3px' }}>
          {title}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '9px', lineHeight: 1.5 }}>
          {description}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '6px',
              background: '#f5f4ef', color: '#555', border: '1px solid #e2e0d8',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', fontWeight: 500,
          color: status === 'live' ? '#1D9E75' : '#aaa',
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: status === 'live' ? '#1D9E75' : '#EF9F27',
          }} />
          {status === 'live' ? 'Live' : 'Coming soon'}
        </div>
        <button style={{
          fontSize: '11px', padding: '6px 14px', borderRadius: '7px',
          border: 'none', background: '#7F77DD', color: '#fff',
          cursor: 'pointer', fontWeight: 600,
        }}>
          Try it
        </button>
        <button style={{
          fontSize: '11px', padding: '5px 12px', borderRadius: '7px',
          border: '1px solid #d8d6ce', background: '#fff',
          cursor: 'pointer', color: '#555',
        }}>
          Watch demo
        </button>
      </div>
    </div>
  );
}
