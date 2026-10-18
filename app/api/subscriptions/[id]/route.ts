import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  serviceName: z.string().min(1).optional(),
  cost: z.number().positive().optional(),
  billingDate: z.number().min(1).max(31).optional(),
  frequency: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  icon: z.string().nullable().optional(),
});

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const subscription = await prisma.subscription.updateMany({
      where: { id: params.id, userId: session.user.id },
      data,
    });
    return NextResponse.json(subscription);
  } catch (err) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map(i => `${i.path.join(".") || "field"}: ${i.message}`).join("; ");
      return NextResponse.json({ error: message }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.subscription.deleteMany({ where: { id: params.id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
