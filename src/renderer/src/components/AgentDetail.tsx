import { useState } from 'react';
import { Agent } from '../types/agent';
import { TokenBar } from './TokenBar';
import { Sparkline } from './Sparkline';

interface AgentDetailProps {
  agent: Agent;
  onClose: () => void;
  onRestart: (id: string) => void;
  onResetSession: (id: string) => void;
  onSwitchModel: (id: string, model: string) => void;
}

const models = ['gpt-4o', 'gpt-4o-mini', 'claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'gemini-2.5-pro'];

const eventStyles = {
  info:    { bg: 'rgba(0,212,255,0.04)', border: 'rgba(0,212,255,0.08)', text: '#00d4ff' },
  warning: { bg: 'rgba(245,158,11,0.04)', border: 'rgba(245,158,11,0.08)', text: '#f59e0b' },
  error:   { bg: 'rgba(255,51,85,0.04)', border: 'rgba(255,51,85,0.08)', text: '#ff3355' },
};

const STATUS = {
  online:   { color: '#00e68a', label: 'Online' },
  offline:  { color: '#ff3355', label: 'Offline' },
  degraded: { color: '#f59e0b', label: 'Degraded' },
};

export function AgentDetail({ agent, onClose, onRestart, onResetSession, onSwitchModel }: AgentDetailProps) {
  const s = STATUS[agent.status];
  const pct = Math.round((agent.tokensUsed / agent.tokensLimit) * 100);
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(agent.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Fake activity sparkline
  const activityData = [12, 28, 22, 35, 30, 42, 38];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[460px] z-50 bg-[#070b14]/98 backdrop-blur-2xl border-l border-white/[0.04] shadow-2xl shadow-black/50 overflow-y-auto animate-slide-in">
        {/* Top accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#070b14]/95 backdrop-blur-2xl border-b border-white/[0.03] px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-white/[0.02] border border-white/[0.04]">
                {agent.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-white/95">{agent.name}</h2>
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wide"
                    style={{ backgroundColor: `${s.color}0c`, color: s.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-white/30">{agent.client}</span>
                  <span className="text-white/10">·</span>
                  <button
                    onClick={copyId}
                    className="text-[10px] font-mono text-white/20 hover:text-[#00d4ff] transition-colors"
                  >
                    {copied ? '✓ copied' : agent.id}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/[0.03] text-white/20 hover:text-white/50 transition-all mt-0.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Token Usage — prominent */}
          <Section title="Token Usage">
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-mono text-white/90 tabular-nums">
                  {(agent.tokensUsed / 1000).toFixed(0)}K
                </span>
                <span className="text-[11px] text-white/15 font-mono">/ {(agent.tokensLimit / 1000).toFixed(0)}K</span>
              </div>
              <span className={`text-sm font-mono font-bold tabular-nums ${
                pct >= 90 ? 'text-[#ff3355]' : pct >= 70 ? 'text-[#f59e0b]' : 'text-white/35'
              }`}>{pct}%</span>
            </div>
            <TokenBar used={agent.tokensUsed} limit={agent.tokensLimit} size="md" />
          </Section>

          {/* Session Metrics — grid */}
          <Section title="Session">
            <div className="grid grid-cols-3 gap-2">
              <MetricBox label="Uptime" value={agent.uptime} mono />
              <MetricBox label="Messages" value={agent.messagesProcessed.toLocaleString()} mono />
              <MetricBox label="Model" value={agent.model} mono accent />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-white/15">Activity (7d)</span>
              <Sparkline data={activityData} color={s.color} height={16} />
            </div>
          </Section>

          {/* Actions */}
          <Section title="Actions">
            <div className="grid grid-cols-2 gap-2">
              <ActionBtn onClick={() => onRestart(agent.id)} color="#00e68a" label="↻ Restart" />
              <ActionBtn onClick={() => onResetSession(agent.id)} color="#00d4ff" label="⟲ Reset Session" />
            </div>
            <div className="relative mt-2">
              <select
                value={agent.model}
                onChange={(e) => onSwitchModel(agent.id, e.target.value)}
                className="w-full appearance-none px-3 py-2 rounded bg-white/[0.02] border border-white/[0.04] text-white/50 text-[11px] font-mono hover:bg-white/[0.03] cursor-pointer focus:outline-none focus:border-[#00d4ff]/15"
              >
                {models.map((m) => (
                  <option key={m} value={m} className="bg-[#0a0f1a] text-white">{m}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/15 pointer-events-none text-[9px]">▼</div>
            </div>
          </Section>

          {/* Activity Log */}
          <Section title="Activity Log">
            <div className="space-y-1">
              {agent.events.map((ev, i) => {
                const es = eventStyles[ev.type];
                return (
                  <div
                    key={ev.id}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded transition-colors hover:bg-white/[0.015] animate-slide-up"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <span
                      className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-px"
                      style={{ backgroundColor: es.bg, color: es.text, border: `1px solid ${es.border}` }}
                    >
                      {ev.type}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-white/40 leading-relaxed">{ev.message}</p>
                      <p className="text-[9px] text-white/12 mt-0.5 font-mono tabular-nums">{ev.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

/* ---- Sub-components ---- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[9px] uppercase tracking-[0.15em] text-white/15 font-bold mb-3 pl-2.5 border-l-2 border-[#00d4ff]/15">
        {title}
      </h3>
      {children}
    </section>
  );
}

function MetricBox({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="rounded bg-white/[0.015] border border-white/[0.03] px-3 py-2.5">
      <div className="text-[9px] text-white/15 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-[12px] leading-tight truncate ${mono ? 'font-mono' : ''} ${accent ? 'text-[#00d4ff]/60' : 'text-white/60'}`}>
        {value}
      </div>
    </div>
  );
}

function ActionBtn({ onClick, color, label }: { onClick: () => void; color: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded text-[11px] font-mono font-semibold transition-all border"
      style={{
        backgroundColor: `${color}06`,
        borderColor: `${color}12`,
        color: `${color}b0`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${color}10`;
        e.currentTarget.style.borderColor = `${color}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = `${color}06`;
        e.currentTarget.style.borderColor = `${color}12`;
      }}
    >
      {label}
    </button>
  );
}
