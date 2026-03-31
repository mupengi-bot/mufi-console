import { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0"
      style={{ backgroundColor: on ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)' }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 shadow-sm"
        style={{
          left: on ? 18 : 2,
          backgroundColor: on ? '#00d4ff' : 'rgba(255,255,255,0.25)',
        }}
      />
    </button>
  );
}

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 max-w-2xl">
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <button
          onClick={onBack}
          className="text-[11px] text-white/20 hover:text-white/50 transition-colors mb-3 flex items-center gap-1 font-mono"
        >
          ← Back
        </button>
        <h1 className="text-[15px] font-bold text-white/90">Settings</h1>
        <p className="text-[11px] text-white/20 mt-0.5">Configure your MUFI Console</p>
      </div>

      <div className="space-y-4">
        {/* API Configuration */}
        <SettingsSection title="API Configuration" delay={0}>
          <SettingsField label="API Endpoint">
            <input
              type="url"
              defaultValue="https://api.openclaw.ai/v1"
              className="w-full bg-white/[0.02] border border-white/[0.04] rounded px-3 py-2 text-[12px] text-white/70 placeholder-white/15 font-mono focus:outline-none focus:border-[#00d4ff]/20 focus:bg-white/[0.03] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </SettingsField>
          <SettingsField label="API Key">
            <input
              type="password"
              defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-white/[0.02] border border-white/[0.04] rounded px-3 py-2 text-[12px] text-white/70 placeholder-white/15 font-mono focus:outline-none focus:border-[#00d4ff]/20 focus:bg-white/[0.03] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </SettingsField>
          <SettingsField label="Polling Interval">
            <select
              defaultValue="30"
              className="w-full appearance-none bg-white/[0.02] border border-white/[0.04] rounded px-3 py-2 text-[12px] text-white/70 font-mono focus:outline-none focus:border-[#00d4ff]/20 cursor-pointer transition-all"
            >
              <option value="5" className="bg-[#0a0f1a]">5 seconds</option>
              <option value="10" className="bg-[#0a0f1a]">10 seconds</option>
              <option value="30" className="bg-[#0a0f1a]">30 seconds</option>
              <option value="60" className="bg-[#0a0f1a]">60 seconds</option>
            </select>
          </SettingsField>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" delay={1}>
          {[
            { label: 'Agent goes offline', desc: 'Alert when any agent loses connection', on: true },
            { label: 'Token limit reached (>90%)', desc: 'Warn before token budget exhausted', on: true },
            { label: 'Agent status degraded', desc: 'Notify on performance degradation', on: false },
            { label: 'Session auto-renewed', desc: 'Log when sessions refresh automatically', on: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 group">
              <div className="mr-4">
                <div className="text-[12px] text-white/50 group-hover:text-white/65 transition-colors font-medium">{item.label}</div>
                <div className="text-[10px] text-white/15 mt-0.5">{item.desc}</div>
              </div>
              <Toggle defaultChecked={item.on} />
            </div>
          ))}
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" delay={2}>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[12px] text-white/50 font-medium">Theme</div>
              <div className="text-[10px] text-white/15 mt-0.5">Interface color scheme</div>
            </div>
            <span className="text-[11px] text-white/20 font-mono bg-white/[0.02] border border-white/[0.03] px-2.5 py-1 rounded">
              Dark
            </span>
          </div>
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About" delay={3}>
          <div className="space-y-2">
            {[
              ['Version', '0.4.0'],
              ['Electron', '33.x'],
              ['Platform', 'macOS arm64'],
              ['Engine', 'MUFI Core'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1">
                <span className="text-[12px] text-white/25">{k}</span>
                <span className="text-[12px] font-mono text-white/45 tabular-nums">{v}</span>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Save */}
        <div className="pt-4 pb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <button className="w-full py-2.5 rounded text-[12px] font-semibold font-mono transition-all bg-[#00d4ff]/10 border border-[#00d4ff]/15 text-[#00d4ff]/80 hover:bg-[#00d4ff]/15 hover:text-[#00d4ff] hover:border-[#00d4ff]/25 hover:shadow-lg hover:shadow-[#00d4ff]/[0.05]">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function SettingsSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <section
      className="rounded-lg border border-white/[0.03] bg-white/[0.01] p-5 animate-slide-up hover:border-white/[0.05] transition-colors"
      style={{ animationDelay: `${delay * 50 + 50}ms` }}
    >
      <h2 className="text-[9px] uppercase tracking-[0.15em] text-white/15 font-bold mb-4 pl-2.5 border-l-2 border-[#00d4ff]/15">
        {title}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}

function SettingsField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] text-white/25 uppercase tracking-wider font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
