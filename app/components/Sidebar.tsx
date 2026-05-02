type NavItemData = {
  label: string;
  dot: string;
  count?: number;
  active?: boolean;
}

const industryItems: NavItemData[] = [
  { label: 'All agents', dot: '#7F77DD', count: 11, active: true },
  { label: 'Food & Bev',  dot: '#1D9E75', count: 7 },
  { label: 'Life Sciences', dot: '#378ADD', count: 4 },
];

const functionItems: NavItemData[] = [
  { label: 'Finance / AR',  dot: '#EF9F27' },
  { label: 'Quality / RCA', dot: '#D85A30' },
  { label: 'Traceability',  dot: '#378ADD' },
  { label: 'Procurement',   dot: '#7F77DD' },
  { label: 'Sales / CRM',   dot: '#1D9E75' },
];

const statusItems: NavItemData[] = [
  { label: 'Live',         dot: '#1D9E75' },
  { label: 'Coming soon',  dot: '#EF9F27' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: 600, color: '#555',
      letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '8px',
    }}>
      {children}
    </div>
  );
}

function NavItem({ item }: { item: NavItemData }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px',
      padding: '6px 8px', borderRadius: '8px', marginBottom: '3px',
      background: item.active ? '#2e2a4a' : 'transparent',
      color: item.active ? '#AFA9EC' : '#888',
      fontWeight: item.active ? 500 : 400,
      cursor: 'pointer',
    }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: item.dot, flexShrink: 0,
      }} />
      {item.label}
      {item.count !== undefined && (
        <span style={{
          marginLeft: 'auto', fontSize: '10px',
          ...(item.active
            ? { background: '#3d3860', padding: '1px 6px', borderRadius: '6px', color: '#AFA9EC' }
            : { color: '#555' }),
        }}>
          {item.count}
        </span>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside style={{
      width: '168px', minWidth: '168px', background: '#161616',
      borderRight: '1px solid #2a2a2a', padding: '16px 12px',
    }}>
      <SectionLabel>Industry</SectionLabel>
      {industryItems.map(item => <NavItem key={item.label} item={item} />)}

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Function</SectionLabel>
        {functionItems.map(item => <NavItem key={item.label} item={item} />)}
      </div>

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Status</SectionLabel>
        {statusItems.map(item => <NavItem key={item.label} item={item} />)}
      </div>
    </aside>
  );
}
