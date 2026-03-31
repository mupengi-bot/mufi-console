import { useState } from 'react';
import { Agent } from '../types/agent';
import { TokenBar } from './TokenBar';

interface AgentDetailProps {
  agent: Agent;
  onClose: () => void;
  onRestart: (id: string) => void;
  onResetSession: (id: string) => void;
  onSwitchModel: (id: string, model: string) => void;
}

const models = ['gpt-4o', 'gpt-4o-mini', 'claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'gemini-2.5-pro'];

const eventTypeStyles = {
  info: 'text-[#00aaff] bg-[#00aaff]/10',
  warning: 'text-yellow-400 bg-yellow-400/10',
  error: 'text-[#ff3355] bg-[#ff3355]/10',
};

const statusConfig = {
  online: { dot: 'bg-[#00ff88]', text: 'text-[#00ff88]', label: 'Online' },
  offline: { dot: 'bg-[#ff3355]', text: 'text-[#ff3355]', label: 'Offline' },
  degraded: { dot: 'bg-yellow-400', text: 'text-yellow-400', label: 'Degraded' },
};

export function AgentDetail({ agent, onClose, onRestart, onResetSession, onSwitchModel }: AgentDetailProps) {
  const status = statusConfig[agent.status];
  const [copied, setCopied] = useState(false);

  const copyAgentId = () => {
    navigator.clipboard.writeText(agent.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[440px] z-50 bg-[#0d1220]/95 backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl shadow-black/40 overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#0d1220]/90 backdrop-blur-xl border-b border-white/[0.06] p-5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-white/5">
                {agent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">{agent.name}</h2>
                  <button
                    onClick={copyAgentId}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors"
                    title="Copy Agent ID"
                  >
                    {copied ? '✓ Copied' : 'ID'}
                  </button>
                </div>
                <p className="text-xs text-white/40">{agent.client}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/30 hover:text-white/60"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Status */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-medium">Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
              <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
            </div>
          </section>

          {/* Token Usage */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-medium">Token Usage</h3>
            <TokenBar used={agent.tokensUsed} limit={agent.tokensLimit} size="md" />
            <div className="mt-2 text-xs text-white/30">
              {Math.round((agent.tokensUsed / agent.tokensLimit) * 100)}% consumed
            </div>
          </section>

          {/* Session Info */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-medium">Session</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-[10px] text-white/30 mb-1">Uptime</div>
                <div className="text-sm font-mono text-white/70">{agent.uptime}</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="text-[10px] text-white/30 mb-1">Messages</div>
                <div className="text-sm font-mono text-white/70">{agent.messagesProcessed.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 col-span-2">
                <div className="text-[10px] text-white/30 mb-1">Model</div>
                <div className="text-sm font-mono text-[#00aaff]/80">{agent.model}</div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-medium">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => onRestart(agent.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-[#00ff88]/5 border border-[#00ff88]/10 text-[#00ff88] text-xs font-medium hover:bg-[#00ff88]/10 transition-colors"
              >
                ↻ Restart Agent
              </button>
              <button
                onClick={() => onResetSession(agent.id)}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-[#00aaff]/5 border border-[#00aaff]/10 text-[#00aaff] text-xs font-medium hover:bg-[#00aaff]/10 transition-colors"
              >
                ⟲ Reset Session
              </button>
              <div className="relative">
                <select
                  value={agent.model}
                  onChange={(e) => onSwitchModel(agent.id, e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-xs font-medium hover:bg-white/[0.06] transition-colors cursor-pointer focus:outline-none focus:border-[#00aaff]/30"
                >
                  {models.map((m) => (
                    <option key={m} value={m} className="bg-[#0d1220] text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none text-[10px]">
                  ▼
                </div>
              </div>
            </div>
          </section>

          {/* Activity Log */}
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-medium">Recent Activity</h3>
            <div className="space-y-1.5">
              {agent.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-white/[0.02]"
                >
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${eventTypeStyles[event.type]} mt-0.5 shrink-0`}>
                    {event.type}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] text-white/50 leading-relaxed">{event.message}</p>
                    <p className="text-[9px] text-white/20 mt-0.5">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
