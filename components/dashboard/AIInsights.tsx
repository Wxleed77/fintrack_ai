"use client";
import { useState } from "react";
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, Info, RefreshCw } from "lucide-react";

type InsightType = "warning" | "tip" | "success" | "info";
interface Insight { type: InsightType; title: string; message: string }

const icons: Record<InsightType, any> = {
  warning: AlertTriangle, tip: Lightbulb, success: CheckCircle, info: Info,
};
const colors: Record<InsightType, string> = {
  warning: "text-amber-500", tip: "text-blue-500", success: "text-emerald-500", info: "text-violet-500",
};
const bgColors: Record<InsightType, string> = {
  warning: "bg-amber-500/10 border-amber-500/20",
  tip: "bg-blue-500/10 border-blue-500/20",
  success: "bg-emerald-500/10 border-emerald-500/20",
  info: "bg-violet-500/10 border-violet-500/20",
};

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", { method: "POST" });
      const data = await res.json();
      setInsights(data.insights || []);
      setLoaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm">AI Insights</h3>
        </div>
        {loaded && (
          <button
            onClick={load}
            className="btn-ghost p-1.5 rounded-lg"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {!loaded ? (
        <button
          onClick={load}
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
        </button>
      ) : (
        <div className="space-y-2.5">
          {insights.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-3">No insights available</p>
          ) : (
            insights.map((insight, i) => {
              const Icon = icons[insight.type];
              return (
                <div
                  key={i}
                  className={`flex gap-2.5 p-3 rounded-xl border ${bgColors[insight.type]}`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${colors[insight.type]}`} />
                  <div>
                    {insight.title && (
                      <p className="text-xs font-semibold text-[var(--text-primary)] mb-0.5">{insight.title}</p>
                    )}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}