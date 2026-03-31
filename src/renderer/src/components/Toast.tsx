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
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const typeStyles = {
  success: 'border-[#00ff88]/20 bg-[#00ff88]/10 text-[#00ff88]',
  info: 'border-[#00aaff]/20 bg-[#00aaff]/10 text-[#00aaff]',
  warning: 'border-yellow-400/20 bg-yellow-400/10 text-yellow-400',
  error: 'border-[#ff3355]/20 bg-[#ff3355]/10 text-[#ff3355]',
};

const typeIcons = { success: '✓', info: 'ℹ', warning: '⚠', error: '✕' };

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => setVisible(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={onDismiss}
      className={`pointer-events-auto px-4 py-3 rounded-xl border backdrop-blur-xl text-xs font-medium flex items-center gap-2 shadow-lg shadow-black/30 cursor-pointer transition-all duration-300 ${typeStyles[item.type]} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
    >
      <span className="text-sm">{typeIcons[item.type]}</span>
      {item.message}
    </div>
  );
}
