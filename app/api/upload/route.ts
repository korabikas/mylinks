import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAuth, unauthorized } from "@/lib/auth-guards";

export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "-").toLowerCase();
    const uniqueName = `${Date.now()}-${safeName}`;

    const blob = await put(uniqueName, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
