'use client';

import { useCart } from './CartContext';
import EnquiryForm from './EnquiryForm';

type Props = { onClose: () => void };

export default function CartDrawer({ onClose }: Props) {
  const { items, removeItem, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          zIndex: 40,
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
        maxWidth: '100vw', background: '#fff', zIndex: 50,
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #e2e0d8',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>
              Your Shortlist
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              {items.length === 0 ? 'No agents shortlisted' : `${items.length} agent${items.length > 1 ? 's' : ''} shortlisted`}
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e0d8',
            background: '#fff', cursor: 'pointer', fontSize: '16px', color: '#555',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            ×
          </button>
        </div>

        {/* Selected agents */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0efe9' }}>
          {items.length === 0 ? (
            <div style={{
              padding: '20px', background: '#f5f4ef', borderRadius: '10px',
              textAlign: 'center', fontSize: '13px', color: '#888',
            }}>
              Add agents from the marketplace to shortlist them for a demo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', background: '#f5f4ef', borderRadius: '8px',
                  border: '1px solid #e2e0d8',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}>
                    {item.name}
                  </span>
                  <button onClick={() => removeItem(item.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '16px', color: '#aaa', lineHeight: 1,
                  }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enquiry form */}
        <div style={{ padding: '20px', flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', marginBottom: '14px' }}>
            Your details
          </div>
          <EnquiryForm
            defaultAgents={items.map(i => i.name)}
            onSuccess={() => {
              clearCart();
              setTimeout(onClose, 1800);
            }}
          />
        </div>
      </div>
    </>
  );
}
