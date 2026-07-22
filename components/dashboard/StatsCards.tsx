"use client";
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  summary?: { income: number; expenses: number; savings: number; savingsRate: number };
  isLoading?: boolean;
}

function StatCard({
  label, value, icon: Icon, accentColor, barColor,
}: {
  label: string;
  value: string;
  icon: any;
  accentColor: string;
  barColor: string;
}) {
  const numeric = parseFloat(value.replace(/[^0-9.-]/g, ""));
  const { ref, display } = useCountUp(isNaN(numeric) ? 0 : numeric);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3, boxShadow: "0 4px 12px rgba(13, 17, 23, 0.08)" }}
      className="card p-4 relative overflow-hidden"
    >
      {/* Indigo left accent */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-sm"
        style={{ backgroundColor: barColor }}
      />
      <div className="flex items-center justify-between mb-3 pl-3">
        <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
        <Icon className={`h-4 w-4 ${accentColor}`} />
      </div>
      <p className={`text-xl lg:text-2xl font-bold num pl-3 ${accentColor}`}>
        <span ref={ref}>{display}</span>
        {value.includes("%") ? "%" : ""}
      </p>
    </motion.div>
  );
}

export function StatsCards({ summary, isLoading }: Props) {
  const cards = [
    {
      label: "Monthly Income",
      value: formatCurrency(summary?.income || 0),
      icon: TrendingUp,
      accentColor: "text-teal-500",
      barColor: "#14b8a6",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(summary?.expenses || 0),
      icon: TrendingDown,
      accentColor: "text-coral-500",
      barColor: "#fb7185",
    },
    {
      label: "Net Savings",
      value: formatCurrency(summary?.savings || 0),
      icon: DollarSign,
      accentColor: "text-indigo-500",
      barColor: "#4f6ef7",
    },
    {
      label: "Savings Rate",
      value: `${summary?.savingsRate || 0}%`,
      icon: PiggyBank,
      accentColor: "text-violet-500",
      barColor: "#8b5cf6",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="card p-4 space-y-3">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-6 w-28" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
      {/* Subtle animated gradient orb behind cards */}
      <motion.div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #4f6ef7 0%, #14b8a6 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}