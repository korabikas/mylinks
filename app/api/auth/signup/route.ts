import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  username: z.string().min(2).max(40),
  email: z.string().email().max(100),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { username, email, name, password } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] },
    });

    if (existing) {
      if (existing.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: "USER",
        backgroundType: "color",
        backgroundValue: "#ffffff",
        buttonColor: "#f4256f",
        buttonTextColor: "#ffffff",
        buttonStyle: "rounded",
      },
      omit: { password: true, fullName: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    }
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
