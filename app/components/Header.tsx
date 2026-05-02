export default function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 18px', background: '#1e1e1e', borderBottom: '1px solid #2e2e2e',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#fff' }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '6px', background: '#7F77DD',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
        </div>
        AIS Marketplace
        <span style={{
          background: '#2e2a4a', color: '#AFA9EC', fontSize: '10px',
          padding: '2px 7px', borderRadius: '8px', fontWeight: 500,
        }}>
          BETA
        </span>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{
        background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px',
        padding: '6px 14px', fontSize: '12px', color: '#888', minWidth: '240px',
      }}>
        Search agents, capabilities...
      </div>

      <div style={{
        background: '#1a3a28', color: '#4ade80', fontSize: '11px',
        padding: '3px 9px', borderRadius: '8px', fontWeight: 500,
      }}>
        2 new agents
      </div>

      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', background: '#2e2a4a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 500, color: '#AFA9EC',
      }}>
        SA
      </div>
    </header>
  );
}
