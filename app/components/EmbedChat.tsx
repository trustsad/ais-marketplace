'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = { role: 'user' | 'agent'; text: string };

type Props = {
  agentId: string;
  flowId?: string;
  agentName: string;
  agentEmoji: string;
  isLive: boolean;
};

const CYCLE = [
  'Connecting to agent…',
  'Querying data…',
  'Gathering records…',
  'Analyzing results…',
  'Formatting response…',
  'Almost there…',
];

export default function EmbedChat({ agentId, flowId, agentName, agentEmoji, isLive }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) { setStatusMsg(''); return; }
    let idx = 0;
    setStatusMsg(CYCLE[0]);
    const t = setInterval(() => { idx = (idx + 1) % CYCLE.length; setStatusMsg(CYCLE[idx]); }, 3500);
    return () => clearInterval(t);
  }, [loading]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const send = async () => {
    const userText = input.trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const endpoint = process.env.NEXT_PUBLIC_CHAT_PROXY_URL
        ? `${process.env.NEXT_PUBLIC_CHAT_PROXY_URL}/api/chat`
        : '/api/chat';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, flowId, message: userText }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string; detail?: string };
        setMessages(m => [...m, { role: 'agent', text: `Error: ${data.error ?? `HTTP ${res.status}`}` }]);
        setLoading(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let agentMsgAdded = false;

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw) as { chunk?: string; error?: string; done?: boolean; progress?: string };
            if (parsed.progress) { setStatusMsg(parsed.progress); }
            if (parsed.error) {
              const errText = `Error: ${parsed.error}`;
              if (agentMsgAdded) setMessages(m => [...m.slice(0, -1), { role: 'agent', text: errText }]);
              else setMessages(m => [...m, { role: 'agent', text: errText }]);
              break outer;
            }
            if (parsed.chunk) {
              fullText += parsed.chunk;
              setLoading(false);
              if (!agentMsgAdded) { agentMsgAdded = true; setMessages(m => [...m, { role: 'agent', text: fullText }]); }
              else setMessages(m => [...m.slice(0, -1), { role: 'agent', text: fullText }]);
            }
          } catch { /* skip */ }
        }
      }

      if (!agentMsgAdded) setMessages(m => [...m, { role: 'agent', text: fullText || 'The agent is taking longer than expected. Please try again.' }]);
    } catch {
      setMessages(m => [...m, { role: 'agent', text: 'Something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100%',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#fff', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid #e2e0d8',
        display: 'flex', alignItems: 'center', gap: '10px',
        background: '#fff', flexShrink: 0,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: '#EBF4FF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', flexShrink: 0,
        }}>
          {agentEmoji}
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>{agentName}</div>
          <div style={{ fontSize: '11px', color: isLive ? '#1D9E75' : '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isLive ? '#1D9E75' : '#ccc' }} />
            {isLive ? 'Live' : 'Coming soon'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{
        flex: 1, overflowY: 'auto', padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        background: '#fafaf8',
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{agentEmoji}</div>
            <div style={{ fontSize: '13px' }}>Ask {agentName} anything</div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '9px 13px', borderRadius: '10px',
              fontSize: '13px', lineHeight: 1.55,
              background: m.role === 'user' ? '#7F77DD' : '#fff',
              color: m.role === 'user' ? '#fff' : '#1a1a1a',
              border: m.role === 'agent' ? '1px solid #e2e0d8' : 'none',
              whiteSpace: m.role === 'user' ? 'pre-wrap' : undefined,
            }}>
              {m.role === 'user' ? m.text : (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (messages.length === 0 || messages[messages.length - 1].role === 'user') && (
          <div style={{ display: 'flex' }}>
            <div style={{
              padding: '9px 13px', borderRadius: '10px', background: '#fff',
              border: '1px solid #e2e0d8', fontSize: '13px', color: '#888',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ display: 'inline-block', animation: 'pulse 1.4s ease-in-out infinite' }}>{agentEmoji}</span>
              <span key={statusMsg} style={{ animation: 'fadeIn 0.4s ease' }}>{statusMsg}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid #e2e0d8',
        background: '#fff', display: 'flex', gap: '8px', flexShrink: 0,
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={isLive ? 'Type a message… (Enter to send)' : 'This agent is coming soon'}
          disabled={!isLive || loading}
          rows={1}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: '8px',
            border: '1px solid #e2e0d8', fontSize: '13px', resize: 'none',
            outline: 'none', fontFamily: 'inherit', color: '#1a1a1a',
            background: !isLive ? '#f5f4ef' : '#fff',
          }}
        />
        <button
          onClick={send}
          disabled={!isLive || loading || !input.trim()}
          style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: !isLive || loading || !input.trim() ? '#c4c1ee' : '#7F77DD',
            color: '#fff', fontSize: '13px', fontWeight: 600,
            cursor: !isLive || loading || !input.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </div>

      <div style={{ padding: '5px 12px', background: '#f5f4ef', fontSize: '10px', color: '#bbb', textAlign: 'center', flexShrink: 0 }}>
        Powered by Aptean AI Agent Marketplace
      </div>
    </div>
  );
}
