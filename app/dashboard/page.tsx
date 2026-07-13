"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SpendingChart } from "@/components/charts/SpendingChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { GoalsWidget } from "@/components/dashboard/GoalsWidget";
import { AIInsights } from "@/components/dashboard/AIInsights";

const dashboardCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

async function getCachedData(key: string, fetcher: () => Promise<any>) {
  const cached = dashboardCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data;
  const data = await fetcher();
  dashboardCache.set(key, { data, timestamp: Date.now() });
  return data;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchDashboard = useCallback(() => {
    if (!mountedRef.current) return;
    setIsLoading(true);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    dashboardCache.clear();

    Promise.all([
      getCachedData("analytics", () =>
        fetch(`/api/analytics?month=${month}&year=${year}`).then(r => r.json())
      ),
      getCachedData("transactions", () =>
        fetch(`/api/transactions?month=${month}&year=${year}&limit=5`).then(r => r.json())
      ),
      getCachedData("budgets", () =>
        fetch(`/api/budgets?month=${month}&year=${year}`).then(r => r.json())
      ),
      getCachedData("goals", () =>
        fetch("/api/goals").then(r => r.json())
      ),
    ]).then(([anal, txns, bdgs, gls]) => {
      if (mountedRef.current) {
        setAnalytics(anal);
        setTransactions(txns.transactions || []);
        setBudgets(bdgs);
        setGoals(gls);
        setIsLoading(false);
      }
    }).catch(err => {
      console.error("Dashboard fetch error:", err);
      if (mountedRef.current) setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchDashboard();

    const handler = () => fetchDashboard();
    window.addEventListener("fin:data-change", handler);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("fin:data-change", handler);
    };
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <StatsCards summary={analytics?.summary} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TrendChart data={analytics?.trend || []} isLoading={isLoading} />
          <RecentTransactions transactions={transactions} isLoading={isLoading} />
        </div>
        <div className="space-y-6">
          <AIInsights />
          <SpendingChart data={analytics?.categoryBreakdown || []} isLoading={isLoading} />
          <GoalsWidget goals={goals} isLoading={isLoading} />
          <BudgetOverview budgets={budgets} spending={analytics?.categoryBreakdown || []} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}