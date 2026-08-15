import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastLevel = 'info' | 'warning' | 'critical';

export interface Toast {
  id: string | number;
  level: ToastLevel;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  toasts: Toast[];
  onRemove: (id: string | number) => void;
}

const LEVEL_STYLES: Record<
  ToastLevel,
  { border: string; text: string; icon: string; glow: string }
> = {
  info: {
    border: 'color-mix(in srgb, var(--neon-cyan) 40%, transparent)',
    text: 'var(--neon-cyan)',
    icon: 'ℹ️',
    glow: 'var(--neon-cyan)',
  },
  warning: {
    border: 'color-mix(in srgb, var(--neon-gold) 40%, transparent)',
    text: 'var(--neon-gold)',
    icon: '⚠️',
    glow: 'var(--neon-gold)',
  },
  critical: {
    border: 'color-mix(in srgb, var(--neon-pink) 40%, transparent)',
    text: 'var(--neon-pink)',
    icon: '💔',
    glow: 'var(--neon-pink)',
  },
};

export function NotificationToast({ toasts, onRemove }: NotificationToastProps) {
  if (!toasts?.length) return null;
  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-50 flex flex-col items-center gap-1.5 pointer-events-none px-4"
      style={{ maxWidth: '320px', margin: '0 auto' }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string | number) => void }) {
  const style = LEVEL_STYLES[toast.level];
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="pointer-events-auto w-full rounded px-3 py-2 text-xs font-mono flex items-start gap-2 cursor-pointer"
      style={{
        background: 'var(--terminal-bg)',
        border: `1px solid ${style.border}`,
        color: style.text,
        boxShadow: `0 0 8px color-mix(in srgb, ${style.glow} 20%, transparent)`,
      }}
      onClick={() => onRemove(toast.id)}
    >
      <span className="flex-shrink-0 text-sm">{style.icon}</span>
      <span className="leading-relaxed">{toast.message}</span>
    </motion.div>
  );
}
