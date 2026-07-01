import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileView } from "@/components/public/profile-view";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    omit: { password: true, fullName: true },
  });

  if (!user) return { title: "Not Found" };

  return {
    title: `${user.name} | MyLinks`,
    description: user.bio || `All links for ${user.name}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { username },
    omit: { password: true, fullName: true },
    include: { links: true },
  });

  if (!user) {
    notFound();
  }

  const isOwner = session?.user?.id === user.id;
  const isAuthenticated = !!session?.user;

  return <ProfileView user={user} isOwner={isOwner} isAuthenticated={isAuthenticated} />;
}
