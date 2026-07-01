import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

  // Migrate existing admin email if present
  await prisma.user.updateMany({
    where: { username: "admin" },
    data: { email: adminEmail },
  });

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedAdminPassword,
      role: Role.ADMIN,
      username: "admin",
      name: "Administrator",
    },
    create: {
      email: adminEmail,
      username: "admin",
      name: "Administrator",
      fullName: "Administrator",
      role: Role.ADMIN,
      password: hashedAdminPassword,
      bio: "Site administrator",
      backgroundType: "color",
      backgroundValue: "#ffffff",
      buttonColor: "#f4256f",
      buttonTextColor: "#ffffff",
      buttonStyle: "rounded",
    },
  });

  console.log(`Admin user ensured: ${admin.email}`);

  // Remove old example users that may contain real personal information
  await prisma.user.deleteMany({
    where: {
      username: { in: ["solequeenfeet", "QueenMaya"] },
    },
  });

  // Create a generic demo account (clearly fake example data only)
  const demoPassword = process.env.DEMO_PASSWORD || "demo123456";
  const hashedDemoPassword = await bcrypt.hash(demoPassword, 12);

  const demoLinks = [
    {
      title: "My Website",
      url: "https://example.com",
      icon: "Globe",
    },
    {
      title: "Twitter / X",
      url: "https://x.com/exampleuser",
      icon: "Twitter",
    },
    {
      title: "Instagram",
      url: "https://instagram.com/exampleuser",
      icon: "Instagram",
    },
    {
      title: "YouTube Channel",
      url: "https://youtube.com/@exampleuser",
      icon: "Youtube",
    },
  ];

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {
      username: "exampleuser",
      name: "Example User",
      fullName: "Example User",
      password: hashedDemoPassword,
    },
    create: {
      email: "demo@example.com",
      username: "exampleuser",
      name: "Example User",
      fullName: "Example User",
      bio: "This is a demo profile. Customize it from your dashboard.",
      location: "The Internet",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=exampleuser",
      backgroundType: "color",
      backgroundValue: "#ffffff",
      buttonColor: "#f4256f",
      buttonTextColor: "#ffffff",
      buttonStyle: "rounded",
      role: Role.USER,
      password: hashedDemoPassword,
      links: {
        create: demoLinks.map((link, index) => ({ ...link, order: index })),
      },
    },
  });

  console.log(`Demo user ensured: ${demoUser.username}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
