import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-auth";

const createUserSchema = z.object({
  username: z.string().min(2).max(40),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  avatar: z.string().url().max(1000).optional().or(z.literal("")),
  backgroundType: z.enum(["color", "image"]).default("color"),
  backgroundValue: z.string().max(200).default("#000000"),
  buttonColor: z.string().max(50).default("#ffffff"),
  buttonTextColor: z.string().max(50).default("#000000"),
  buttonStyle: z.enum(["rounded", "square", "pill"]).default("rounded"),
  password: z.string().min(6).optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const users = await prisma.user.findMany({
    omit: { password: true, fullName: true },
    include: { _count: { select: { links: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const user = await prisma.user.create({
      omit: { password: true, fullName: true },
      data: {
        username: data.username.toLowerCase(),
        email: data.email.toLowerCase(),
        name: data.name,
        bio: data.bio,
        avatar: data.avatar || null,
        backgroundType: data.backgroundType,
        backgroundValue: data.backgroundValue,
        buttonColor: data.buttonColor,
        buttonTextColor: data.buttonTextColor,
        buttonStyle: data.buttonStyle,
        password: data.password ? await bcrypt.hash(data.password, 12) : null,
        role: "USER",
      },
    });
    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
