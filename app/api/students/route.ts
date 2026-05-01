import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim();
    const classroomId = request.nextUrl.searchParams.get("classroomId")?.trim();
    const teacherEmail = request.nextUrl.searchParams.get("teacherEmail")?.trim();

    const where: {
      email?: string;
      classroomId?: string;
      classroom?: {
        teacher: {
          email: string;
        };
      };
    } = {};

    if (email) {
      where.email = email;
    }

    if (classroomId) {
      where.classroomId = classroomId;
    }

    if (teacherEmail) {
      where.classroom = {
        teacher: {
          email: teacherEmail,
        },
      };
    }

    const students = await prisma.student.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gradeLabel: true,
        classroomCode: true,
        classroomId: true,
        classroom: {
          select: {
            id: true,
            name: true,
            code: true,
            teacherId: true,
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, grade, classroomId, classroomCode } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields (firstName, lastName, email, password)" },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: "Student with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let resolvedClassroomCode: string | null = classroomCode || null;

    if (classroomId) {
      const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
        select: { id: true, code: true },
      });

      if (!classroom) {
        return NextResponse.json(
          { error: "Selected classroom could not be found" },
          { status: 400 }
        );
      }

      resolvedClassroomCode = classroom.code;
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gradeLabel: grade || null,
        classroomId: classroomId || null,
        classroomCode: resolvedClassroomCode,
      },
    });

    return NextResponse.json(
      { success: true, student: { id: student.id, email: student.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
