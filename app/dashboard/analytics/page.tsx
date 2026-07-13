"use client";
import { useEffect, useState } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { SpendingChart } from "@/components/charts/SpendingChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getMonthName } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch(`/api/analytics?month=${month}&year=${year}`).then(r => r.json()).then(setData);
  }, [month, year]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your financial trends and patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 p-1.5 bg-[var(--bg-hover)] rounded-xl">
            <Calendar className="h-4 w-4 text-[var(--text-tertiary)] ml-1" />
            <select value={month} onChange={e => setMonth(+e.target.value)} className="select border-0 bg-transparent py-1 text-xs">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{getMonthName(m)}</option>
              ))}
            </select>
            <select value={year} onChange={e => setYear(+e.target.value)} className="select border-0 bg-transparent py-1 text-xs">
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <StatsCards summary={data?.summary} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart data={data?.trend || []} />
        </div>
        <div>
          <SpendingChart data={data?.categoryBreakdown || []} />
        </div>
      </div>
    </div>
  );
}