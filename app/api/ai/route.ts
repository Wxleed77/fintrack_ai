import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const [transactions, budgets, goals] = await Promise.all([
      prisma.transaction.findMany({ where: { userId: session.user.id, date: { gte: start, lte: end } } }),
      prisma.budget.findMany({ where: { userId: session.user.id, month, year } }),
      prisma.savingsGoal.findMany({ where: { userId: session.user.id } }),
    ]);

    const income = transactions.filter(t => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);
    const categoryMap: Record<string, number> = {};
    transactions.filter(t => t.type === "EXPENSE").forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const prompt = `You are a personal finance advisor. Analyze this user's financial data and provide 4-5 actionable, specific insights in JSON format.

Financial Summary (current month):
- Total Income: PKR ${income.toLocaleString()}
- Total Expenses: PKR ${expenses.toLocaleString()}
- Savings: PKR ${(income - expenses).toLocaleString()}
- Savings Rate: ${income > 0 ? Math.round(((income - expenses) / income) * 100) : 0}%

Spending by Category:
${Object.entries(categoryMap).map(([cat, amt]) => `- ${cat}: PKR ${amt.toLocaleString()}`).join("\n")}

Budgets:
${budgets.map(b => `- ${b.category}: PKR ${(categoryMap[b.category] || 0).toLocaleString()} / PKR ${b.limitAmount.toLocaleString()} limit`).join("\n")}

Savings Goals:
${goals.map(g => `- ${g.goalName}: PKR ${g.currentAmount.toLocaleString()} / PKR ${g.targetAmount.toLocaleString()} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`).join("\n")}

Return ONLY a JSON array of insights with this structure:
[{ "type": "warning|tip|success|info", "title": "short title", "message": "specific actionable message" }]`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "[]";
    const clean = text.replace(/```json|```/g, "").trim();

    return NextResponse.json({ insights: JSON.parse(clean) });
  } catch (error) {
    console.error("AI insights error:", error);
    return NextResponse.json({
      insights: [
        {
          type: "info",
          title: "AI Insights",
          message: "Unable to generate AI insights at this time. Please try again later."
        }
      ]
    });
  }
}
