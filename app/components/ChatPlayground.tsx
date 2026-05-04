'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'agent';
  text: string;
};

type Props = {
  agentId: string;
  agentName: string;
  agentEmoji: string;
  isLive: boolean;
};

export default function ChatPlayground({ agentId, agentName, agentEmoji, isLive }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  if (!isLive) {
    return (
      <div style={{
        padding: '32px', background: '#fafaf8', border: '1px solid #e2e0d8',
        borderRadius: '12px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚧</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Coming soon</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
          This agent is still being prepared. Add it to your enquiry to get early access.
        </div>
      </div>
    );
  }

  const send = async () => {
    const userText = input.trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userText }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, message: userText }),
      });
      const data = await res.json();
      const replyText = data.text ?? (data.error ? `Error: ${data.error}${data.detail ? `\n\n${data.detail}` : ''}` : 'No response.');
      setMessages(m => [...m, { role: 'agent', text: replyText }]);
    } catch {
      setMessages(m => [...m, { role: 'agent', text: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ border: '1px solid #e2e0d8', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Messages */}
      <div ref={messagesRef} style={{
        minHeight: '280px', maxHeight: '420px', overflowY: 'auto',
        padding: '16px', background: '#fafaf8', display: 'flex',
        flexDirection: 'column', gap: '10px',
      }}>
        {messages.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: '32px', marginBottom: '6px' }}>{agentEmoji}</div>
            <div style={{ fontSize: '13px' }}>Ask {agentName} anything</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '75%', padding: '9px 13px', borderRadius: '10px',
              fontSize: '13px', lineHeight: 1.55,
              background: m.role === 'user' ? '#7F77DD' : '#fff',
              color: m.role === 'user' ? '#fff' : '#1a1a1a',
              border: m.role === 'agent' ? '1px solid #e2e0d8' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{
              padding: '9px 13px', borderRadius: '10px', background: '#fff',
              border: '1px solid #e2e0d8', fontSize: '13px', color: '#aaa',
            }}>
              {agentEmoji} thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input row */}
      <div style={{
        display: 'flex', gap: '8px', padding: '10px 12px',
        borderTop: '1px solid #e2e0d8', background: '#fff',
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '8px',
            border: '1px solid #e2e0d8', fontSize: '13px', resize: 'none',
            outline: 'none', fontFamily: 'inherit', color: '#1a1a1a',
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: loading || !input.trim() ? '#c4c1ee' : '#7F77DD',
            color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </div>
      <div style={{
        padding: '6px 12px', background: '#f5f4ef',
        fontSize: '10px', color: '#aaa', textAlign: 'center',
      }}>
        Session only — no chat history is saved
      </div>
    </div>
  );
}
