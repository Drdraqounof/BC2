import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function formatTeacherResponse(teacher: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  school: { name: string } | null;
}) {
  return {
    id: teacher.id,
    email: teacher.email,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    schoolName: teacher.school?.name ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim();

    if (email) {
      const teacher = await prisma.teacher.findUnique({
        where: { email },
        include: { school: true },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: "Teacher not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(formatTeacherResponse(teacher));
    }

    const teachers = await prisma.teacher.findMany({
      include: { school: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(teachers.map(formatTeacherResponse));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, school, subject } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if teacher already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "Teacher with this email already exists" },
        { status: 409 }
      );
    }

    // Create or connect to school
    let schoolRecord = null;
    if (school) {
      schoolRecord = await prisma.school.upsert({
        where: { name: school },
        update: {},
        create: { name: school },
      });
    }

    // Create teacher
    const teacher = await prisma.teacher.create({
      data: {
        email,
        firstName,
        lastName,
        schoolId: schoolRecord?.id,
      },
    });

    return NextResponse.json(
      { success: true, teacher },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
