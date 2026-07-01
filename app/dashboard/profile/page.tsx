import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserEditor } from "@/components/admin/user-editor";

export default async function DashboardProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      links: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
      <UserEditor user={user} selfEdit />
    </div>
  );
}
