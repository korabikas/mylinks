import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data";
import { ProfileView } from "@/components/public/profile-view";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) return { title: "Not Found" };

  return {
    title: `${user.name} | MyLinks`,
    description: user.bio || `All links for ${user.name}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = getUserByUsername(username);

  if (!user) {
    notFound();
  }

  return <ProfileView user={user} />;
}
