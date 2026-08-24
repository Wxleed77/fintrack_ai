import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string(),
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.string(),
  paymentMethod: z.string().default("cash"),
  notes: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  // Clamp pagination to prevent DoS via excessive limits or deep offsets
  const requestedPage = parseInt(searchParams.get("page") || "1");
  const requestedLimit = parseInt(searchParams.get("limit") || "20");
  const page = Number.isFinite(requestedPage) && requestedPage >= 1 ? requestedPage : 1;
  const limit = Number.isFinite(requestedLimit) && requestedLimit >= 1
    ? Math.min(requestedLimit, 100)
    : 20;

  const where: any = { userId: session.user.id };
  if (type) where.type = type;
  if (category) where.category = category;
  if (month && year) {
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const transaction = await prisma.transaction.create({
      data: { ...data, date: new Date(data.date), userId: session.user.id },
    });
    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map(i => `${i.path.join(".") || "field"}: ${i.message}`).join("; ");
      return NextResponse.json({ error: message }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
