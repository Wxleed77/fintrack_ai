import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryColor } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  // Single query covering the whole 6-month window; aggregation happens in memory
  const windowStart = new Date(year, month - 6, 1);
  const windowEnd = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id, date: { gte: windowStart, lte: windowEnd } },
    select: { type: true, amount: true, category: true, date: true },
  });

  const currentStart = new Date(year, month - 1, 1);
  const currentEnd = new Date(year, month, 0, 23, 59, 59);

  const currentTxns = transactions.filter(t => t.date >= currentStart && t.date <= currentEnd);

  const income = currentTxns.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenses = currentTxns.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  const categoryMap: Record<string, number> = {};
  currentTxns.filter(t => t.type === "EXPENSE").forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0,
    color: categoryColor(category),
  })).sort((a, b) => b.amount - a.amount);

  // 6-month trend from the same result set
  const trend: { month: string; income: number; expenses: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthTxns = transactions.filter(t => t.date >= s && t.date <= e);
    trend.push({
      month: d.toLocaleString("default", { month: "short" }),
      income: monthTxns.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0),
      expenses: monthTxns.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0),
    });
  }

  return NextResponse.json({
    summary: { income, expenses, savings: income - expenses, savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0 },
    categoryBreakdown,
    trend,
  });
}
