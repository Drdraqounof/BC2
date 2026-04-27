import { prisma } from "../lib/prisma";

async function main() {
  try {
    // Add teacher
    const teacher = await prisma.teacher.upsert({
      where: { email: "rob@launchpadphilly.org" },
      update: {},
      create: {
        email: "rob@launchpadphilly.org",
        firstName: "Rob",
        lastName: "Launchpad",
        school: {
          connectOrCreate: {
            where: { name: "Launchpad Philadelphia" },
            create: { name: "Launchpad Philadelphia" },
          },
        },
      },
    });

    console.log("✅ Teacher created/updated:", teacher);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
