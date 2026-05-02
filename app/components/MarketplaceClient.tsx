'use client';

import { useState, useMemo } from 'react';
import { useCart } from './CartContext';
import Header from './Header';
import Sidebar from './Sidebar';
import AgentCard from './AgentCard';
import CartDrawer from './CartDrawer';
import type { Agent } from '@/lib/agents';

function RequestCard() {
  return (
    <div style={{
      background: '#f5f4ef', border: '1.5px dashed #ccc', borderRadius: '14px',
      padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      minHeight: '200px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%', border: '1.5px dashed #bbb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px', color: '#bbb',
      }}>
        +
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Request an agent</div>
      <div style={{ fontSize: '12px', color: '#888', lineHeight: 1.5 }}>
        Have a use case in mind? Submit it to the AIS team.
      </div>
      <button style={{
        fontSize: '12px', padding: '7px 16px', borderRadius: '8px',
        border: '1px solid #ccc', background: '#fff', cursor: 'pointer', color: '#666',
      }}>
        Request
      </button>
    </div>
  );
}

type Props = { agents: Agent[] };

export default function MarketplaceClient({ agents }: Props) {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { items } = useCart();

  const filtered = useMemo(() => agents.filter(a => {
    if (activeIndustry && !a.industry.includes(activeIndustry)) return false;
    if (activeFunction && a.function !== activeFunction) return false;
    if (activeStatus && a.status !== activeStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !a.name.toLowerCase().includes(q) &&
        !a.tagline.toLowerCase().includes(q) &&
        !a.tags.some(t => t.toLowerCase().includes(q))
      ) return false;
    }
    return true;
  }), [agents, activeIndustry, activeFunction, activeStatus, search]);

  const handleIndustry = (v: string) => setActiveIndustry(prev => (prev === v || v === '') ? null : v);
  const handleFunction = (v: string) => setActiveFunction(prev => (prev === v || v === '') ? null : v);
  const handleStatus   = (v: string) => setActiveStatus(prev => (prev === v || v === '') ? null : v);

  const filterLabel = activeIndustry ?? activeFunction ?? (activeStatus ? 'Status filter' : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        cartCount={items.length}
        onCartOpen={() => setCartOpen(true)}
        search={search}
        onSearch={setSearch}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar
          agents={agents}
          activeIndustry={activeIndustry}
          activeFunction={activeFunction}
          activeStatus={activeStatus}
          onIndustry={handleIndustry}
          onFunction={handleFunction}
          onStatus={handleStatus}
        />

        <main style={{ flex: 1, padding: '18px', background: '#f0efe9', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
              {filterLabel ? filterLabel : 'All agents'}{' '}
              <span style={{ fontWeight: 400, color: '#888', fontSize: '12px' }}>
                — {filtered.length} available
              </span>
            </div>
            <div style={{
              fontSize: '11px', color: '#666', border: '1px solid #d8d6ce',
              padding: '4px 10px', borderRadius: '7px', background: '#fff',
            }}>
              Sort: Most used
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '14px',
          }}>
            {filtered.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
            <RequestCard />
          </div>
        </main>
      </div>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
