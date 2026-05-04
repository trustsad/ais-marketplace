'use client';

import { useState } from 'react';

type Props = {
  defaultAgents: string[];
  onSuccess?: () => void;
  mode?: 'enquiry' | 'request';
};

export default function EnquiryForm({ defaultAgents, onSuccess, mode = 'enquiry' }: Props) {
  const isRequest = mode === 'request';
  const [form, setForm] = useState({
    name: '', email: '', company: '', message: '',
    agents: defaultAgents.join(', '),
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, agents: form.agents }),
    });
    setSubmitting(false);
    setDone(true);
    onSuccess?.();
  };

  if (done) {
    return (
      <div style={{
        padding: '28px', background: '#f0fdf6', border: '1px solid #a7f3d0',
        borderRadius: '12px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#065f46' }}>Thanks! We&apos;ll be in touch soon.</div>
        <div style={{ fontSize: '13px', color: '#047857', marginTop: '4px' }}>
          Our team will reach out within 1 business day.
        </div>

      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #e2e0d8', fontSize: '13px', color: '#1a1a1a',
    background: '#fff', outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: '#555', marginBottom: '5px',
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input required style={inputStyle} value={form.name}
            onChange={e => set('name', e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input required type="email" style={inputStyle} value={form.email}
            onChange={e => set('email', e.target.value)} placeholder="you@company.com" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Company *</label>
        <input required style={inputStyle} value={form.company}
          onChange={e => set('company', e.target.value)} placeholder="Company name" />
      </div>
      <div>
        <label style={labelStyle}>{isRequest ? 'Agent Idea Name' : 'Agents interested in'}</label>
        <input style={inputStyle} value={form.agents}
          onChange={e => set('agents', e.target.value)}
          placeholder={isRequest ? 'Give your agent idea a name' : 'Agent names'} />
      </div>
      <div>
        <label style={labelStyle}>{isRequest ? 'Agent Idea' : 'Message'}</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
          value={form.message} onChange={e => set('message', e.target.value)}
          placeholder={isRequest ? 'Describe what you want this agent to do…' : 'Tell us about your use case...'} />
      </div>
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '10px 0', borderRadius: '8px', border: 'none',
          background: submitting ? '#a5a3e8' : '#7F77DD', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? 'Sending…' : isRequest ? 'Submit request' : 'Send enquiry'}
      </button>
    </form>
  );
}
