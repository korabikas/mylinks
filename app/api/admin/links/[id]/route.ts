import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/admin-auth";

const updateLinkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().max(1000).optional(),
  displayUrl: z.string().max(500).optional().or(z.literal("")),
  icon: z.string().max(100).optional().or(z.literal("")),
  coverImage: z.string().url().max(1000).optional().or(z.literal("")),
  nsfw: z.boolean().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await request.json();
  const parsed = updateLinkSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updateData: any = { ...data };
  if (data.icon === "") updateData.icon = null;

  const link = await prisma.link.update({ where: { id }, data: updateData });
  return NextResponse.json(link);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return unauthorized();

  const { id } = await params;
  await prisma.link.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
