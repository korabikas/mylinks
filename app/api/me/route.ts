import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized } from "@/lib/auth-guards";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  avatar: z.string().url().max(1000).optional().or(z.literal("")),
  backgroundType: z.enum(["color", "image"]).optional(),
  backgroundValue: z.string().max(200).optional(),
  buttonColor: z.string().max(50).optional(),
  buttonTextColor: z.string().max(50).optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
});

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    omit: { password: true, fullName: true },
    include: {
      links: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = { ...data };
  if (data.avatar === "") updateData.avatar = null;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    omit: { password: true, fullName: true },
    data: updateData,
  });

  return NextResponse.json(user);
}
