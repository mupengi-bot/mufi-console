import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContextValue {
  toast: (message: string, type?: ToastItem['type']) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-1.5 pointer-events-none">
        {toasts.map((t) => (
          <ToastItemView key={t.id} item={t} onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const COLORS = {
  success: '#00e68a',
  info: '#00d4ff',
  warning: '#f59e0b',
  error: '#ff3355',
};

const ICONS = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' };

function ToastItemView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const c = COLORS[item.type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setVisible(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={onDismiss}
      className={`pointer-events-auto px-4 py-2.5 rounded border backdrop-blur-xl text-[11px] font-mono font-semibold flex items-center gap-2 shadow-lg shadow-black/30 cursor-pointer transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
      style={{
        backgroundColor: `${c}08`,
        borderColor: `${c}15`,
        color: c,
      }}
    >
      <span className="text-xs opacity-70">{ICONS[item.type]}</span>
      {item.message}
    </div>
  );
}
