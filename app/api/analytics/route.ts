import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_COLORS } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id, date: { gte: start, lte: end } },
  });

  const income = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  const expenseTxns = transactions.filter(t => t.type === "EXPENSE");
  const categoryMap: Record<string, number> = {};
  expenseTxns.forEach(t => { categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount; });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0,
    color: (CATEGORY_COLORS as Record<string, string>)[category] || "#888780",
  })).sort((a, b) => b.amount - a.amount);

  // 6-month trend
  const trend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - 1 - i, 1);
    const s = new Date(d.getFullYear(), d.getMonth(), 1);
    const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const monthTxns = await prisma.transaction.findMany({
      where: { userId: session.user.id, date: { gte: s, lte: e } },
    });
    trend.push({
      month: d.toLocaleString("default", { month: "short" }),
      income: monthTxns.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0),
      expenses: monthTxns.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0),
    });
  }

  return NextResponse.json({
    summary: { income, expenses, savings: income - expenses, savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0 },
    categoryBreakdown,
    trend,
  });
}
