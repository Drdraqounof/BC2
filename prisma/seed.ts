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
  update: {
    firstName: "Rob",
    lastName: "Launchpad",
    schoolId: school.id,
  },
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

      await prisma.student.upsert({
        where: { email: data.email },
        update: {
          firstName: data.firstName,
          lastName: data.lastName,
          password: hashedPassword,
          gradeLabel: `Grade ${data.grade}`,
          classroomCode: data.classroomCode,
        },
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          gradeLabel: `Grade ${data.grade}`,
          classroomCode: data.classroomCode,
        },
      });

      console.log(`   ℹ️  Student ${data.email} created/updated`);
    }

    console.log("✅ 4 students created/updated");

    // Get all students
    const students = await prisma.student.findMany();

    // Create campaigns
    const campaign1 = await prisma.campaign.upsert({
      where: { id: "campaign-missing-assignments" },
      update: {},
      create: {
        id: "campaign-missing-assignments",
        title: "Missing Assignments Recovery",
        description: "Help students complete outstanding assignments",
        type: "MISSING_ASSIGNMENTS_RECOVERY",
        goal: "Get all students caught up on missing work",
        status: "IN_PROGRESS",
        startDate: new Date(),
        ownerId: teacher.id,
      },
    });

    const campaign2 = await prisma.campaign.upsert({
      where: { id: "campaign-attendance" },
      update: {},
      create: {
        id: "campaign-attendance",
        title: "Attendance Improvement",
        description: "Improve student attendance rates",
        type: "ATTENDANCE_IMPROVEMENT",
        goal: "Increase attendance to 95%+",
        status: "IN_PROGRESS",
        startDate: new Date(),
        ownerId: teacher.id,
      },
    });

    console.log("✅ 2 campaigns created/updated:", campaign1.id, campaign2.id);

    // Link students to campaigns
    for (const student of students.slice(0, 2)) {
      await prisma.campaignStudent.upsert({
        where: {
          campaignId_studentId: {
            campaignId: campaign1.id,
            studentId: student.id,
          },
        },
        update: {},
        create: {
          campaignId: campaign1.id,
          studentId: student.id,
          status: "PENDING",
        },
      });
    }

    for (const student of students.slice(2, 4)) {
      await prisma.campaignStudent.upsert({
        where: {
          campaignId_studentId: {
            campaignId: campaign2.id,
            studentId: student.id,
          },
        },
        update: {},
        create: {
          campaignId: campaign2.id,
          studentId: student.id,
          status: "PENDING",
        },
      });
    }

    console.log("✅ Students linked to campaigns");

    const studentByEmail = new Map(students.map((student) => [student.email, student]));

    const seededTasks = [
      {
        id: "task-missing-algebra",
        title: "Complete Missing Algebra Worksheet",
        description: "Finish sections 3 through 5 and show all work for each problem.",
        dueDate: new Date("2026-05-10T00:00:00.000Z"),
        priority: "HIGH" as const,
        rubric: "All answers must include work shown and at least one written reflection on errors corrected.",
        attachmentLinks: ["https://example.com/algebra-worksheet.pdf"],
        campaignId: campaign1.id,
        studentEmails: ["maya.thompson@school.edu", "noah.rivera@school.edu"],
      },
      {
        id: "task-attendance-checkin",
        title: "Attendance Reflection Check-In",
        description: "Write a short reflection about attendance barriers and one support you need this week.",
        dueDate: new Date("2026-05-08T00:00:00.000Z"),
        priority: "MEDIUM" as const,
        rubric: "Complete all three reflection prompts with specific details.",
        attachmentLinks: ["https://example.com/attendance-reflection.docx"],
        campaignId: campaign2.id,
        studentEmails: ["eli.johnson@school.edu", "ava.patel@school.edu"],
      },
      {
        id: "task-biology-practice",
        title: "Biology Practice Quiz Review",
        description: "Review the quiz corrections sheet and submit updated answers for missed questions.",
        dueDate: new Date("2026-05-12T00:00:00.000Z"),
        priority: "MEDIUM" as const,
        rubric: "Correct all missed responses and explain why the new answer is accurate.",
        attachmentLinks: ["https://example.com/biology-quiz-review.pdf"],
        campaignId: campaign2.id,
        studentEmails: ["eli.johnson@school.edu"],
      },
      {
        id: "task-peer-review-essay",
        title: "Peer Review Essay Feedback",
        description: "Review a peer essay and provide one strength and one revision suggestion.",
        dueDate: new Date("2026-05-14T00:00:00.000Z"),
        priority: "LOW" as const,
        rubric: "Feedback must be constructive, specific, and use complete sentences.",
        attachmentLinks: ["https://example.com/peer-review-guide.pdf"],
        campaignId: null,
        studentEmails: ["maya.thompson@school.edu", "ava.patel@school.edu"],
      },
    ];

    for (const seededTask of seededTasks) {
      const task = await prisma.task.upsert({
        where: { id: seededTask.id },
        update: {
          title: seededTask.title,
          description: seededTask.description,
          dueDate: seededTask.dueDate,
          priority: seededTask.priority,
          rubric: seededTask.rubric,
          attachmentLinks: JSON.stringify(seededTask.attachmentLinks),
          campaignId: seededTask.campaignId,
          creatorId: teacher.id,
        },
        create: {
          id: seededTask.id,
          title: seededTask.title,
          description: seededTask.description,
          dueDate: seededTask.dueDate,
          priority: seededTask.priority,
          rubric: seededTask.rubric,
          attachmentLinks: JSON.stringify(seededTask.attachmentLinks),
          campaignId: seededTask.campaignId,
          creatorId: teacher.id,
        },
      });

      for (const studentEmail of seededTask.studentEmails) {
        const student = studentByEmail.get(studentEmail);

        if (!student) {
          throw new Error(`Missing seeded student for task assignment: ${studentEmail}`);
        }

        await prisma.taskAssignment.upsert({
          where: {
            taskId_studentId: {
              taskId: task.id,
              studentId: student.id,
            },
          },
          update: {},
          create: {
            taskId: task.id,
            studentId: student.id,
          },
        });
      }
    }

    console.log("✅ Tasks and task assignments created/updated for all seeded students");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
