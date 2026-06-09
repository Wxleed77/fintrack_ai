"use client";
import { useEffect, useState } from "react";
import { TrendChart } from "@/components/charts/TrendChart";
import { SpendingChart } from "@/components/charts/SpendingChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { getMonthName } from "@/lib/utils";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch(`/api/analytics?month=${month}&year=${year}`).then(r => r.json()).then(setData);
  }, [month, year]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(+e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{getMonthName(m)}</option>)}
          </select>
          <select value={year} onChange={e => setYear(+e.target.value)} className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none">
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <StatsCards summary={data?.summary} />
      <TrendChart data={data?.trend || []} />
      <SpendingChart data={data?.categoryBreakdown || []} />
    </div>
  );
}
