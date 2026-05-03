'use client';

import type { Agent } from '@/lib/agents';

type Props = {
  agents: Agent[];
  activeIndustry: string | null;
  activeFunction: string | null;
  activeProductLine: string | null;
  activeStatus: string | null;
  onIndustry: (v: string) => void;
  onFunction: (v: string) => void;
  onProductLine: (v: string) => void;
  onStatus: (v: string) => void;
};

const industryDots: Record<string, string> = {
  'Food & Beverage': '#1D9E75',
  'Life Sciences':   '#378ADD',
};

const functionDots: Record<string, string> = {
  'Finance / AR':  '#EF9F27',
  'Quality / RCA': '#D85A30',
  'Traceability':  '#378ADD',
  'Procurement':   '#7F77DD',
  'Sales / CRM':   '#1D9E75',
};

const productLineDots: Record<string, string> = {
  // Microsoft BC and its verticals
  'Business Central':        '#0078D4',
  'JustFoodERP':             '#1D9E75',
  'bcFood':                  '#2BAE80',
  'Food & Beverage':         '#3DBE6E',
  'Apparel':                 '#C0397A',
  'Equipment':               '#D97706',
  // Aptean ERPs
  'Travers':                 '#7C3AED',
  'Traverse Global':         '#6D28D9',
  'Made2Manage':             '#B45309',
  'M2M':                     '#B45309',
  'ProcessPro':              '#0369A1',
  'Ross':                    '#DC2626',
  'Mistral ERP':             '#9333EA',
  'oxaion ERP':              '#0891B2',
  'Apparel Next Gen':        '#DB2777',
  'Aptean Food & Beverage ERP': '#15803D',
  'Equipment DMS':           '#D97706',
  'Equipsoft':               '#B45309',
  'Lascom PLM':              '#0284C7',
  'Logility - DAI+':         '#7C3AED',
  'TLX':                     '#059669',
  'Intuitive':               '#0891B2',
  'Paragon':                 '#6366F1',
  'rs2':                     '#0891B2',
  'Southware':               '#D97706',
};

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

function NavItem({
  label, dot, count, active, onClick,
}: {
  label: string; dot: string; count?: number; active: boolean; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px',
        padding: '6px 8px', borderRadius: '8px', marginBottom: '3px',
        background: active ? '#2e2a4a' : 'transparent',
        color: active ? '#AFA9EC' : '#888',
        fontWeight: active ? 500 : 400, cursor: 'pointer',
      }}
    >
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {label}
      {count !== undefined && (
        <span style={{
          marginLeft: 'auto', fontSize: '10px',
          ...(active
            ? { background: '#3d3860', padding: '1px 6px', borderRadius: '6px', color: '#AFA9EC' }
            : { color: '#555' }),
        }}>
          {count}
        </span>
      )}
    </div>
  );
}

export default function Sidebar({
  agents, activeIndustry, activeFunction, activeProductLine, activeStatus,
  onIndustry, onFunction, onProductLine, onStatus,
}: Props) {
  const industries   = Array.from(new Set(agents.flatMap((a) => a.industry)));
  const functions    = Array.from(new Set(agents.map((a) => a.function)));
  const productLines = Array.from(new Set(agents.map((a) => a.productLine).filter(Boolean)));

  const countByIndustry    = (v: string) => agents.filter(a => a.industry.includes(v)).length;
  const countByFunction    = (v: string) => agents.filter(a => a.function === v).length;
  const countByProductLine = (v: string) => agents.filter(a => a.productLine === v).length;
  const liveCount          = agents.filter(a => a.status === 'live').length;
  const comingSoonCount    = agents.filter(a => a.status === 'coming-soon').length;

  const allActive = !activeIndustry && !activeFunction && !activeProductLine && !activeStatus;

  return (
    <aside style={{
      width: '168px', minWidth: '168px', background: '#161616',
      borderRight: '1px solid #2a2a2a', padding: '16px 12px',
    }}>
      {/* All agents */}
      <NavItem
        label="All agents" dot="#7F77DD" count={agents.length}
        active={allActive}
        onClick={() => { onIndustry(''); onFunction(''); onProductLine(''); onStatus(''); }}
      />

      {productLines.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <SectionLabel>Product Line</SectionLabel>
          {productLines.map(pl => (
            <NavItem
              key={pl} label={pl}
              dot={productLineDots[pl] ?? '#888'}
              count={countByProductLine(pl)}
              active={activeProductLine === pl}
              onClick={() => onProductLine(pl)}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Industry</SectionLabel>
        {industries.map(ind => (
          <NavItem
            key={ind}
            label={ind === 'Food & Beverage' ? 'Food & Bev' : ind}
            dot={industryDots[ind] ?? '#888'}
            count={countByIndustry(ind)}
            active={activeIndustry === ind}
            onClick={() => onIndustry(ind)}
          />
        ))}
      </div>

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Function</SectionLabel>
        {functions.map(fn => (
          <NavItem
            key={fn} label={fn}
            dot={functionDots[fn] ?? '#888'}
            count={countByFunction(fn)}
            active={activeFunction === fn}
            onClick={() => onFunction(fn)}
          />
        ))}
      </div>

      <div style={{ marginTop: '14px' }}>
        <SectionLabel>Status</SectionLabel>
        {liveCount > 0 && (
          <NavItem label="Live" dot="#1D9E75" count={liveCount}
            active={activeStatus === 'live'} onClick={() => onStatus('live')} />
        )}
        {comingSoonCount > 0 && (
          <NavItem label="Coming soon" dot="#EF9F27" count={comingSoonCount}
            active={activeStatus === 'coming-soon'} onClick={() => onStatus('coming-soon')} />
        )}
      </div>
    </aside>
  );
}
