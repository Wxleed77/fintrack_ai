"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Subscription } from "@/types";
import { RefreshCw } from "lucide-react";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    fetch("/api/subscriptions").then(r => r.json()).then(setSubs);
  }, []);

  const monthlyTotal = subs.filter(s => s.isActive && s.frequency === "MONTHLY").reduce((sum, s) => sum + s.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        <div className="bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 rounded-xl px-4 py-2">
          <p className="text-xs text-red-500 font-medium">Monthly burn</p>
          <p className="text-lg font-bold text-red-600">{formatCurrency(monthlyTotal)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subs.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">{sub.serviceName}</p>
                <p className="text-xs text-gray-400">{sub.frequency} · Bills on day {sub.billingDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(sub.cost)}</p>
                <p className="text-xs text-gray-400">{sub.frequency.toLowerCase()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
