import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/apiClient';
import { AppLayout } from '../layouts/AppLayout';
import { SectionLabel } from '../components/editorial/SectionLabel';
import { Loader2, ArrowRight, Cpu } from 'lucide-react';
import { useAuth } from '../app/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STARTER_QUESTIONS = [
  'What should I work on today?',
  'Why is AI Evaluation my biggest gap?',
  'Am I ready for an AI PM interview?',
  'How can I improve my PRD writing?',
];

export const CopilotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCopilotHistory()
      .then(history => {
        if (history.length > 0) {
          setMessages(history.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })));
        }
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.sendCopilotMessage(text);
      const assistantMsg: Message = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `System error: ${err.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full" style={{ height: 'calc(100vh - 48px)' }}>
        {/* Header */}
        <div className="px-6 py-4 rule-b bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-ink flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-accent-blue" />
            </div>
            <div>
              <SectionLabel figure="FIG. 06" title="AI Career Copilot" className="mb-0 border-0 pb-0" />
              <p className="font-mono text-[11px] text-ink-muted">
                Context-aware — reads your actual skill state & career goal
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {historyLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
              <span className="label-figure text-ink-muted">LOADING CONVERSATION...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="max-w-2xl">
              <div className="p-5 bg-ink text-white mb-6">
                <p className="label-figure text-accent-blue mb-2">SYSTEM / INTELLIGENCE</p>
                <p className="font-mono text-sm text-white leading-relaxed">
                  Hello, {user?.name?.split(' ')[0]}. I have analyzed your profile against the AI Product Manager role.
                  Ask me anything about your skill gaps, next actions, or interview readiness.
                </p>
              </div>

              <p className="label-figure text-ink-muted mb-3">SUGGESTED QUERIES</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {STARTER_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="p-3 bg-white rule-all text-left hover:bg-paper-subtle hover:border-ink transition-colors group"
                  >
                    <p className="font-mono text-xs text-ink leading-snug">{q}</p>
                    <ArrowRight className="w-3 h-3 text-ink-muted mt-1 group-hover:text-accent-blue transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={`max-w-sm lg:max-w-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-ink text-white'
                        : 'bg-white rule-all border-l-2 border-l-accent-blue'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <p className="label-figure text-accent-blue text-[10px] mb-2">COPILOT INTELLIGENCE</p>
                    )}
                    <p className="font-mono text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="label-figure text-[9px] mt-2 opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rule-all border-l-2 border-l-accent-blue p-4">
                    <p className="label-figure text-accent-blue text-[10px] mb-2">REASONING...</p>
                    <Loader2 className="w-4 h-4 animate-spin text-ink-muted" />
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 rule-t bg-white flex-shrink-0">
          <div className="flex items-center space-x-3 max-w-2xl">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Ask about your skill gaps, next actions, or interview readiness..."
              className="flex-1 px-3 py-2.5 bg-paper rule-all font-mono text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="flex items-center space-x-1 px-4 py-2.5 bg-ink text-white hover:bg-accent-blue transition-colors font-mono font-semibold text-xs uppercase tracking-widest disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="label-figure text-ink-muted text-[10px] mt-2">ENTER to send · Context-aware AI reads your live skill state</p>
        </div>
      </div>
    </AppLayout>
  );
};
