export default function RequestCard() {
  return (
    <div style={{
      background: '#f5f4ef', border: '1.5px dashed #ccc', borderRadius: '12px',
      padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%', border: '1.5px dashed #bbb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', color: '#aaa', fontWeight: 300,
      }}>
        +
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>Request an agent</div>
      <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.5 }}>
        Have a use case? Submit it to the AIS team.
      </div>
      <button style={{
        fontSize: '11px', padding: '5px 14px', borderRadius: '7px',
        border: '1px solid #ccc', background: '#fff', cursor: 'pointer', color: '#666',
      }}>
        Request
      </button>
    </div>
  );
}
