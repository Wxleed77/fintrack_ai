import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1).max(30),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export const dynamic = 'force-dynamic';
const MAX_CATEGORIES = 50;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = schema.parse(body);

    // Category names are case-insensitive and unique per user (incl. built-ins)
    const name = data.name;
    const isBuiltIn = data.type === "EXPENSE"
      ? EXPENSE_CATEGORIES.some(c => c.toLowerCase() === name.toLowerCase())
      : INCOME_CATEGORIES.some(c => c.toLowerCase() === name.toLowerCase());

    const existing = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        _count: { select: { categories: true } },
        categories: { where: { name: { equals: name, mode: "insensitive" } }, select: { id: true } },
      },
    });

    if (isBuiltIn || existing?.categories.length) {
      return NextResponse.json({ error: `Category "${name}" already exists` }, { status: 409 });
    }
    if ((existing?._count.categories ?? 0) + 1 > MAX_CATEGORIES) {
      return NextResponse.json({ error: `You can have up to ${MAX_CATEGORIES} custom categories` }, { status: 422 });
    }

    const category = await prisma.category.create({ data: { ...data, name, userId: session.user.id } });
    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map(i => `${i.path.join(".") || "field"}: ${i.message}`).join("; ");
      return NextResponse.json({ error: message }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
