import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  goalName: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  currentAmount: z.number().min(0).optional(),
  deadline: z.string().nullable().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const goal = await prisma.savingsGoal.updateMany({
      where: { id: params.id, userId: session.user.id },
      data: {
        ...data,
        ...(data.deadline !== undefined
          ? { deadline: data.deadline ? new Date(data.deadline) : null }
          : {}),
      },
    });
    return NextResponse.json(goal);
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

  await prisma.savingsGoal.deleteMany({ where: { id: params.id, userId: session.user.id } });
  return NextResponse.json({ success: true });
}
