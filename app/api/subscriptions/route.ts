import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  serviceName: z.string().min(1),
  cost: z.number().positive(),
  billingDate: z.number().min(1).max(31),
  frequency: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).default("MONTHLY"),
  category: z.string().default("Entertainment"),
  icon: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const subscriptions = await prisma.subscription.findMany({ where: { userId: session.user.id }, orderBy: { serviceName: "asc" } });
  return NextResponse.json(subscriptions);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const data = schema.parse(body);
  const sub = await prisma.subscription.create({ data: { ...data, userId: session.user.id } });
  return NextResponse.json(sub, { status: 201 });
}
