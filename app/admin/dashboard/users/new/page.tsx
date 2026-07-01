import { UserEditor } from "@/components/admin/user-editor";

export default function NewUserPage() {
  const emptyUser = {
    id: "new",
    username: "",
    email: "",
    name: "",
    fullName: null,
    bio: null,
    location: null,
    avatar: null,
    backgroundType: "color" as const,
    backgroundValue: "#ffffff",
    buttonColor: "#f4256f",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded" as const,
    role: "USER" as const,
    links: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerified: null,
    image: null,
    password: null,
  };

  return <UserEditor user={emptyUser} isNew />;
}
