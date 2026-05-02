import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AgentRow from "./components/AgentRow";
import AgentCard from "./components/AgentCard";
import RequestCard from "./components/RequestCard";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '18px', background: '#f0efe9', overflowY: 'auto' }}>

          {/* Title bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
              All agents{' '}
              <span style={{ fontWeight: 400, color: '#888', fontSize: '12px' }}>— 11 available</span>
            </div>
            <div style={{
              fontSize: '11px', color: '#666', border: '1px solid #d8d6ce',
              padding: '4px 10px', borderRadius: '7px', background: '#fff',
            }}>
              Sort: Most used
            </div>
          </div>

          {/* Featured full-width rows */}
          <AgentRow
            emoji="💳"
            iconBg="#EEEDFE"
            title="AR Aging Agent"
            description="Accounts receivable analysis, overdue tracking, customer payment insights from BC"
            tags={['AR Ledger', 'Customer table', 'retrieveData']}
            status="live"
          />
          <div style={{ marginBottom: '18px' }}>
            <AgentRow
              emoji="🔬"
              iconBg="#E1F5EE"
              title="Recall & Trace Expert"
              description="Full forward/backward lot traceability, finished goods impact, regulatory recall support"
              tags={['Lot tracking', 'Item Ledger', 'F&B / LS']}
              status="live"
            />
          </div>

          {/* More agents grid */}
          <div style={{
            fontSize: '11px', fontWeight: 600, color: '#888',
            letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            More agents
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
            <AgentCard
              featured
              emoji="📊"
              iconBg="#FAEEDA"
              title="Vendor Scorecard"
              description="Dynamic supplier scoring with configurable weights, MCP-driven."
              industry={{ label: 'F&B', bg: '#E1F5EE', color: '#0F6E56' }}
              stars={5}
            />
            <AgentCard
              emoji="🚨"
              iconBg="#FCEBEB"
              title="RCA Agent"
              description="Root cause analysis, z-score & chi-square. Zero narration."
              industry={{ label: 'F&B', bg: '#E1F5EE', color: '#0F6E56' }}
              stars={4}
            />
            <AgentCard
              emoji="🧪"
              iconBg="#E6F1FB"
              title="Quality Inspector"
              description="QC holds, spec deviations, batch release readiness."
              industry={{ label: 'Life Sci', bg: '#E6F1FB', color: '#185FA5' }}
              stars={4}
            />
            <AgentCard
              emoji="🤝"
              iconBg="#E1F5EE"
              title="Customer BC Expert"
              description="360 customer view — orders, balances, contacts."
              industry={{ label: 'F&B', bg: '#E1F5EE', color: '#0F6E56' }}
              stars={5}
            />
            <AgentCard
              emoji="📦"
              iconBg="#FBEAF0"
              title="Production Order"
              description="Batch split, upstream/downstream linkage, scheduler."
              industry={{ label: 'F&B', bg: '#E1F5EE', color: '#0F6E56' }}
              stars={2}
              status="coming-soon"
            />
            <RequestCard />
          </div>

        </main>
      </div>
    </div>
  );
}
