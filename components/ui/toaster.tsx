"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastOptions, ToastType } from "@/lib/toast";

interface ToastItem extends ToastOptions {
  id: number;
  message: string;
  type: ToastType;
}

const icons: Record<ToastType, any> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const accents: Record<ToastType, string> = {
  success: "text-teal-500",
  error: "text-coral-500",
  info: "text-indigo-500",
};

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems(list => list.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as ToastOptions & { message: string };
      if (!detail?.message) return;
      const id = ++counter.current;
      const type: ToastType = detail.type || "info";
      const duration = detail.duration ?? (detail.action ? 7000 : 4000);
      setItems(list => [...list.slice(-2), { id, type, ...detail }]);
      if (duration !== Infinity) {
        setTimeout(() => dismiss(id), duration);
      }
    };
    window.addEventListener("fin:toast", handler);
    return () => window.removeEventListener("fin:toast", handler);
  }, [dismiss]);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
    >
      <AnimatePresence>
        {items.map(item => {
          const Icon = icons[item.type];
          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto card p-3.5 flex items-start gap-3"
              role="status"
            >
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${accents[item.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{item.message}</p>
                {item.action && (
                  <button
                    onClick={() => {
                      item.action!.onClick();
                      dismiss(item.id);
                    }}
                    className="mt-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="btn-ghost p-1 rounded-md flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
