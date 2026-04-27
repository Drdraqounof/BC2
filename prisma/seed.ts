import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcryptjs from "bcryptjs";

async function main() {
  try {
    // Get or create school
    const school = await prisma.school.upsert({
      where: { name: "Launchpad Philadelphia" },
      update: {},
      create: { name: "Launchpad Philadelphia" },
    });

    // Add teacher
    const teacher = await prisma.teacher.upsert({
      where: { email: "rob@launchpadphilly.org" },
      update: {},
      create: {
        email: "rob@launchpadphilly.org",
        firstName: "Rob",
        lastName: "Launchpad",
        schoolId: school.id,
      },
    });

    console.log("✅ Teacher created/updated:", teacher);

    // Add mock students
    const studentData = [
      { firstName: "Maya", lastName: "Thompson", email: "maya.thompson@school.edu", grade: "10", classroomCode: "MATH101" },
      { firstName: "Noah", lastName: "Rivera", email: "noah.rivera@school.edu", grade: "11", classroomCode: "ENG201" },
      { firstName: "Eli", lastName: "Johnson", email: "eli.johnson@school.edu", grade: "9", classroomCode: "SCI301" },
      { firstName: "Ava", lastName: "Patel", email: "ava.patel@school.edu", grade: "12", classroomCode: "HIST401" },
    ];

    for (const data of studentData) {
      const hashedPassword = await bcryptjs.hash("password123", 10);
      
      try {
        await prisma.student.create({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            gradeLabel: `Grade ${data.grade}`,
            classroomCode: data.classroomCode,
          },
        });
      } catch (e: any) {
        // Skip if student already exists
        if (e.code === "P2002") {
          console.log(`   ℹ️  Student ${data.email} already exists`);
        } else {
          throw e;
        }
      }
    }

    console.log("✅ 4 students created/updated");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
