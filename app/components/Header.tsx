'use client';

type HeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
  search: string;
  onSearch: (v: string) => void;
};

export default function Header({ cartCount, onCartOpen, search, onSearch }: HeaderProps) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 18px', background: '#1e1e1e', borderBottom: '1px solid #2e2e2e',
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Logo */}
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

      {/* Search */}
      <input
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search agents, capabilities..."
        style={{
          background: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: '8px',
          padding: '6px 14px', fontSize: '12px', color: '#ccc', minWidth: '240px',
          outline: 'none', fontFamily: 'inherit',
        }}
      />

      {/* New agents badge */}
      <div style={{
        background: '#1a3a28', color: '#4ade80', fontSize: '11px',
        padding: '3px 9px', borderRadius: '8px', fontWeight: 500, whiteSpace: 'nowrap',
      }}>
        2 new agents
      </div>

      {/* Cart button */}
      <button
        onClick={onCartOpen}
        style={{
          position: 'relative', background: '#2e2a4a', border: 'none', borderRadius: '8px',
          padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center',
          gap: '6px', color: '#AFA9EC', fontSize: '12px', fontWeight: 500,
        }}
      >
        <span>🛒</span>
        <span>Enquiry</span>
        {cartCount > 0 && (
          <span style={{
            position: 'absolute', top: '-6px', right: '-6px',
            background: '#7F77DD', color: '#fff', fontSize: '10px',
            fontWeight: 700, width: '18px', height: '18px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cartCount}
          </span>
        )}
      </button>

      {/* Avatar */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', background: '#2e2a4a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 500, color: '#AFA9EC', flexShrink: 0,
      }}>
        SA
      </div>
    </header>
  );
}
