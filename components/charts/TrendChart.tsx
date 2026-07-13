"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { MonthlyTrend } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2.5 text-xs space-y-1" style={{ boxShadow: "0 4px 12px rgba(11, 17, 30, 0.12)" }}>
        <p className="font-semibold text-[var(--text-primary)]">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="num">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendChart({ data, isLoading }: { data: MonthlyTrend[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-48 mb-4" />
        <div className="skeleton h-52 w-full" />
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Income vs Expenses (6 months)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-card)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border-card)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "var(--text-secondary)" }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            fill="url(#income)"
            strokeWidth={2}
            name="Income"
            dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            fill="url(#expenses)"
            strokeWidth={2}
            name="Expenses"
            dot={{ fill: "#f43f5e", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}