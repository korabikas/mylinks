import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserEditor } from "@/components/admin/user-editor";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { links: { orderBy: { order: "asc" } } },
  });

  if (!user) {
    notFound();
  }

  return <UserEditor user={user} />;
}
