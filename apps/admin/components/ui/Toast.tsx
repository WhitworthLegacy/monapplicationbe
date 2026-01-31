'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Sparkles } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'magic';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: ToastAction;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const MAX_TOASTS = 5;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration = 4000,
    action?: ToastAction
  ) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type, duration, action }];
      // Keep only last MAX_TOASTS toasts
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(-MAX_TOASTS);
      }
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          index={index}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
  index,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!toast.duration || toast.duration === 0) return;

    const duration = toast.duration; // Capture for TypeScript
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [toast, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    magic: <Sparkles className="w-5 h-5 text-purple-600" />,
  };

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      progress: 'bg-gradient-to-r from-green-500 to-emerald-500',
      shadow: 'shadow-green-100',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      progress: 'bg-gradient-to-r from-red-500 to-rose-500',
      shadow: 'shadow-red-100',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
      border: 'border-blue-200',
      progress: 'bg-gradient-to-r from-blue-500 to-sky-500',
      shadow: 'shadow-blue-100',
    },
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      progress: 'bg-gradient-to-r from-amber-500 to-yellow-500',
      shadow: 'shadow-amber-100',
    },
    magic: {
      bg: 'bg-gradient-to-r from-purple-50 to-fuchsia-50',
      border: 'border-purple-200',
      progress: 'bg-gradient-to-r from-purple-500 to-fuchsia-500',
      shadow: 'shadow-purple-100',
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`
        relative overflow-hidden
        flex items-start gap-3 px-4 py-3
        rounded-xl border backdrop-blur-sm
        min-w-[320px] max-w-md
        shadow-lg
        pointer-events-auto
        ${style.bg}
        ${style.border}
        ${style.shadow}
        transition-all duration-300 ease-out
        ${
          isExiting
            ? 'opacity-0 translate-x-8 scale-95'
            : 'opacity-100 translate-x-0 scale-100'
        }
      `}
      style={{
        animation: isExiting ? 'none' : 'toast-slide-in 0.3s ease-out',
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div
            className={`h-full transition-all duration-75 ease-linear ${style.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">{icons[toast.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0f172a] leading-relaxed">
          {toast.message}
        </p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              handleClose();
            }}
            className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 text-[#64748b] hover:text-[#0f172a] transition-all duration-200"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Add keyframes to global CSS or Tailwind config
const style = document.createElement('style');
style.textContent = `
  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateX(2rem) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
