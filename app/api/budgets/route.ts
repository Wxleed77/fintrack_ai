import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  category: z.string(),
  limitAmount: z.number().positive(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id, month, year },
  });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = schema.parse(body);

  const budget = await prisma.budget.upsert({
    where: { userId_category_month_year: { userId: session.user.id, ...data } },
    update: { limitAmount: data.limitAmount },
    create: { ...data, userId: session.user.id },
  });
  return NextResponse.json(budget, { status: 201 });
}
