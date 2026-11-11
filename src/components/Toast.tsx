import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-400/50 bg-black/70 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)]",
    error: "border-rose-400/50 bg-black/70 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.25)]",
    info: "border-amber-400/60 bg-black/70 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.3)]",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
        borderColors[toast.type]
      }`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white leading-tight font-['Outfit']">{toast.title}</p>
        {toast.description && (
          <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2 font-normal">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
