'use client';

import type { Agent } from '@/lib/agents';

type Props = {
  agents: Agent[];
  activeIndustry: string | null;
  activeFunction: string | null;
  activeStatus: string | null;
  onIndustry: (v: string) => void;
  onFunction: (v: string) => void;
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
  agents, activeIndustry, activeFunction, activeStatus,
  onIndustry, onFunction, onStatus,
}: Props) {
  const industries = Array.from(new Set(agents.flatMap((a) => a.industry)));
  const functions  = Array.from(new Set(agents.map((a) => a.function)));

  const countByIndustry = (ind: string) => agents.filter(a => a.industry.includes(ind)).length;
  const countByFunction = (fn: string)  => agents.filter(a => a.function === fn).length;
  const liveCount        = agents.filter(a => a.status === 'live').length;
  const comingSoonCount  = agents.filter(a => a.status === 'coming-soon').length;

  return (
    <aside style={{
      width: '168px', minWidth: '168px', background: '#161616',
      borderRight: '1px solid #2a2a2a', padding: '16px 12px',
    }}>
      {/* All agents */}
      <NavItem
        label="All agents" dot="#7F77DD" count={agents.length}
        active={!activeIndustry && !activeFunction && !activeStatus}
        onClick={() => { onIndustry(''); onFunction(''); onStatus(''); }}
      />

      <div style={{ marginTop: '10px' }}>
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
