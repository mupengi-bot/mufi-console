interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-xs text-white/30 hover:text-white/60 transition-colors mb-4 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-lg font-semibold text-white/90">Settings</h1>
        <p className="text-xs text-white/30 mt-1">Configure your MUFI Console preferences</p>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">API Endpoint</label>
              <input
                type="url"
                defaultValue="https://api.openclaw.ai/v1"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00aaff]/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">API Key</label>
              <input
                type="password"
                defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-[#00aaff]/30 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-white/40 mb-1.5">Polling Interval</label>
              <select defaultValue="30" className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/80 focus:outline-none focus:border-[#00aaff]/30 transition-colors cursor-pointer">
                <option value="5" className="bg-[#0d1220]">5 seconds</option>
                <option value="10" className="bg-[#0d1220]">10 seconds</option>
                <option value="30" className="bg-[#0d1220]">30 seconds</option>
                <option value="60" className="bg-[#0d1220]">60 seconds</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">Notifications</h2>
          <div className="space-y-3">
            {[
              { label: 'Agent goes offline', defaultChecked: true },
              { label: 'Token limit reached (>90%)', defaultChecked: true },
              { label: 'Agent status degraded', defaultChecked: false },
              { label: 'Session auto-renewed', defaultChecked: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between py-1 cursor-pointer group">
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-4 h-4 rounded bg-white/5 border-white/10 text-[#00aaff] focus:ring-[#00aaff]/30 focus:ring-offset-0 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">Theme</span>
            <span className="text-xs text-white/30 bg-white/5 px-3 py-1 rounded-lg">Dark (default)</span>
          </div>
        </section>

        {/* About */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-5">
          <h2 className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">About</h2>
          <div className="space-y-2 text-sm text-white/40">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-mono text-white/60">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Electron</span>
              <span className="font-mono text-white/60">33.x</span>
            </div>
            <div className="flex justify-between">
              <span>Platform</span>
              <span className="font-mono text-white/60">macOS</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
