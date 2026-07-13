"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-xs" style={{ boxShadow: "0 4px 12px rgba(11, 17, 30, 0.12)" }}>
        <p className="font-medium text-[var(--text-primary)]">{payload[0].name}</p>
        <p className="num text-[var(--text-secondary)]">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function SpendingChart({ data, isLoading }: { data: CategoryBreakdown[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="skeleton h-5 w-36 mb-4" />
        <div className="flex justify-center mb-4">
          <div className="skeleton h-44 w-44 rounded-full" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-3.5 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Spending Breakdown</h3>
      {data.length === 0 ? (
        <p className="text-sm text-[var(--text-tertiary)] text-center py-8">No expense data</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={76}
                innerRadius={50}
                strokeWidth={2}
                stroke="var(--bg-card)"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {data.slice(0, 5).map((item) => (
              <div key={item.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[var(--text-secondary)]">{item.category}</span>
                </div>
                <span className="text-[var(--text-tertiary)] num font-medium">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}