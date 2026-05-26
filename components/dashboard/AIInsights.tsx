"use client";
import { useState } from "react";
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, Info, RefreshCw } from "lucide-react";

type InsightType = "warning" | "tip" | "success" | "info";
interface Insight { type: InsightType; title: string; message: string }

const icons: Record<InsightType, any> = {
  warning: AlertTriangle, tip: Lightbulb, success: CheckCircle, info: Info,
};
const colors: Record<InsightType, string> = {
  warning: "text-amber-600", tip: "text-blue-600", success: "text-emerald-600", info: "text-purple-600",
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
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-xl border border-emerald-100 dark:border-emerald-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Insights</h3>
        </div>
        {loaded && (
          <button onClick={load} className="p-1 text-gray-400 hover:text-emerald-600 transition-colors">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>
      {!loaded ? (
        <button
          onClick={load}
          disabled={loading}
          className="w-full text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Get AI Analysis"}
        </button>
      ) : (
        <div className="space-y-2">
          {insights.map((insight, i) => {
            const Icon = icons[insight.type];
            return (
              <div key={i} className="flex gap-2">
                <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${colors[insight.type]}`} />
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{insight.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
