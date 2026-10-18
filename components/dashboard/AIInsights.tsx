"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, Info, RefreshCw } from "lucide-react";
import { toastError } from "@/lib/toast";

type InsightType = "warning" | "tip" | "success" | "info";
interface Insight { type: InsightType; title: string; message: string }

const icons: Record<InsightType, any> = {
  warning: AlertTriangle, tip: Lightbulb, success: CheckCircle, info: Info,
};
const colors: Record<InsightType, string> = {
  warning: "text-amber-500", tip: "text-indigo-500", success: "text-teal-500", info: "text-violet-500",
};
const bgColors: Record<InsightType, string> = {
  warning: "bg-amber-500/10 border-amber-500/20",
  tip: "bg-indigo-500/10 border-indigo-500/20",
  success: "bg-teal-500/10 border-teal-500/20",
  info: "bg-violet-500/10 border-violet-500/20",
};

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

function cacheKey() {
  const now = new Date();
  return `fin:ai-insights:${now.getFullYear()}-${now.getMonth() + 1}`;
}

function readCache(): { insights: Insight[]; savedAt: number } | null {
  try {
    const raw = window.localStorage.getItem(cacheKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { insights: Insight[]; savedAt: number };
    if (!Array.isArray(parsed.insights) || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function updateLabel(ms: number): string {
  const mins = Math.round(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    const cached = readCache();
    if (cached?.insights.length) {
      setInsights(cached.insights);
      setUpdatedAt(cached.savedAt);
      setLoaded(true);
    }
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST" });
      if (!res.ok) {
        let message = "AI analysis is unavailable right now. Try again later.";
        try {
          const data = await res.json();
          if (typeof data?.error === "string") message = data.error;
        } catch { /* non-JSON error */
        }
        toastError(message);
        return;
      }
      const data = await res.json();
      const result: Insight[] = data.insights || [];
      setInsights(result);
      setLoaded(true);
      const now = Date.now();
      setUpdatedAt(now);
      try {
        window.localStorage.setItem(cacheKey(), JSON.stringify({ insights: result, savedAt: now }));
      } catch { /* storage full or blocked — ignore */
      }
    } catch (e) {
      console.error(e);
      toastError("AI analysis is unavailable right now. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm">AI Insights</h3>
        </div>
        {loaded && (
          <div className="flex items-center gap-1.5">
            {updatedAt !== null && (
              <span className="text-2xs text-[var(--text-tertiary)]">{updateLabel(Date.now() - updatedAt)}</span>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => load()}
              aria-label="Refresh AI insights"
              className="btn-ghost p-1.5 rounded-md"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        )}
      </div>

      {!loaded ? (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => load()}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Get AI Analysis"
          )}
        </motion.button>
      ) : (
        <motion.div
          className="space-y-2.5"
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
          }}
        >
          {insights.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-3">No insights available</p>
          ) : (
            insights.map((insight, i) => {
              const Icon = icons[insight.type] || Info;
              return (
                <motion.div
                  key={i}
                  variants={{
                    initial: { opacity: 0, y: 6 },
                    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                  }}
                  className={`flex gap-2.5 p-3 rounded-md border ${bgColors[insight.type] || bgColors.info}`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${colors[insight.type] || colors.info}`} />
                  <div>
                    {insight.title && (
                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{insight.title}</p>
                    )}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{insight.message}</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
