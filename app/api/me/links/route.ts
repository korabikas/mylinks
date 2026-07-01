import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, unauthorized } from "@/lib/auth-guards";

const createLinkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url().max(1000),
  displayUrl: z.string().max(1000).optional().or(z.literal("")),
  icon: z.string().max(100).optional().or(z.literal("")),
  coverImage: z.string().url().max(1000).optional().or(z.literal("")),
  nsfw: z.boolean().default(false),
  active: z.boolean().default(true),
});

const reorderSchema = z.object({
  linkIds: z.array(z.string().cuid()),
});

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = createLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const maxOrder = await prisma.link.aggregate({
    where: { userId: session.user.id },
    _max: { order: true },
  });

  const link = await prisma.link.create({
    data: {
      ...data,
      icon: data.icon || null,
      coverImage: data.coverImage || null,
      displayUrl: data.displayUrl || null,
      userId: session.user.id,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  return NextResponse.json(link);
}

export async function PUT(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { linkIds } = parsed.data;

  // Verify all links belong to current user
  const existing = await prisma.link.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((l) => l.id));
  if (!linkIds.every((id) => existingIds.has(id))) {
    return NextResponse.json({ error: "Invalid link IDs" }, { status: 403 });
  }

  await prisma.$transaction(
    linkIds.map((id, index) => prisma.link.update({ where: { id }, data: { order: index } }))
  );

  return NextResponse.json({ success: true });
}
