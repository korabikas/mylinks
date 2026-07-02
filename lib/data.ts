import usersData from "@/data/users.json";

export interface Link {
  id?: string;
  title: string;
  url: string;
  displayUrl?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  order?: number;
  active?: boolean;
  nsfw?: boolean;
}

export interface User {
  username: string;
  name: string;
  bio?: string | null;
  location?: string | null;
  avatar?: string | null;
  backgroundType?: string;
  backgroundValue?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonStyle?: string;
  links: Link[];
}

export function getUsers(): User[] {
  return (usersData as { users: User[] }).users;
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

export function getAllUsernames(): string[] {
  return getUsers().map((user) => user.username);
}
