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

  // Remove old example/demo users so only the admin account remains
  await prisma.user.deleteMany({
    where: {
      username: { in: ["solequeenfeet", "QueenMaya", "exampleuser"] },
    },
  });
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
