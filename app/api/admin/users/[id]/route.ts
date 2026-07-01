import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-auth";

const updateUserSchema = z.object({
  username: z.string().min(2).max(40).optional(),
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  avatar: z.string().url().max(1000).optional().or(z.literal("")),
  backgroundType: z.enum(["color", "image"]).optional(),
  backgroundValue: z.string().max(200).optional(),
  buttonColor: z.string().max(50).optional(),
  buttonTextColor: z.string().max(50).optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
  password: z.string().min(6).optional().or(z.literal("")),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true, fullName: true },
    include: { links: { orderBy: { order: "asc" } } },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  } else if (data.password === "") {
    updateData.password = null;
  }
  delete updateData.password;

  if (data.avatar === "") updateData.avatar = null;
  if (data.username) updateData.username = data.username.toLowerCase();
  if (data.email) updateData.email = data.email.toLowerCase();

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      omit: { password: true, fullName: true },
      include: { links: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;

  if (session.user.id === id) {
    return NextResponse.json(
      { error: "Cannot delete yourself" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
