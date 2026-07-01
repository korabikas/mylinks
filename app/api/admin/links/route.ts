import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-auth";

const createLinkSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1).max(100),
  url: z.string().url().max(1000),
  displayUrl: z.string().max(500).optional().or(z.literal("")),
  icon: z.string().max(100).optional().or(z.literal("")),
  coverImage: z.string().url().max(1000).optional().or(z.literal("")),
  nsfw: z.boolean().default(false),
  active: z.boolean().default(true),
});

const reorderSchema = z.object({
  userId: z.string().cuid(),
  linkIds: z.array(z.string().cuid()),
});

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { userId, ...data } = parsed.data;

  const maxOrder = await prisma.link.aggregate({
    where: { userId },
    _max: { order: true },
  });

  try {
    const link = await prisma.link.create({
      data: {
        ...data,
        icon: data.icon || null,
        coverImage: data.coverImage || null,
        userId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json(link);
  } catch (error: any) {
    if (error.code === "P2003") {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { linkIds } = parsed.data;

  await prisma.$transaction(
    linkIds.map((id, index) =>
      prisma.link.update({ where: { id }, data: { order: index } })
    )
  );

  return NextResponse.json({ success: true });
}
