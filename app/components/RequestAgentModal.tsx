'use client';

import EnquiryForm from './EnquiryForm';

type Props = { onClose: () => void };

export default function RequestAgentModal({ onClose }: Props) {
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

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '480px', maxWidth: 'calc(100vw - 32px)',
        background: '#fff', zIndex: 50,
        borderRadius: '16px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        display: 'flex', flexDirection: 'column',
        maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #e2e0d8',
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>
              Request an Agent
            </div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              Tell us what you need — our team will build it.
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

        {/* Form */}
        <div style={{ padding: '20px' }}>
          <EnquiryForm
            defaultAgents={[]}
            mode="request"
            onSuccess={() => setTimeout(onClose, 1800)}
          />
        </div>
      </div>
    </>
  );
}
