import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

function buildClassroomCode(name: string) {
  const seed = normalizeCode(name).slice(0, 6) || "CLASS";
  const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "0000";
  return `${seed}-${suffix}`;
}

export async function GET(request: NextRequest) {
  try {
    const teacherEmail = request.nextUrl.searchParams.get("teacherEmail")?.trim();
    const teacherId = request.nextUrl.searchParams.get("teacherId")?.trim();

    if (!teacherEmail && !teacherId) {
      return NextResponse.json(
        { error: "teacherEmail or teacherId is required" },
        { status: 400 }
      );
    }

    const classrooms = await prisma.classroom.findMany({
      where: teacherId
        ? { teacherId }
        : {
            teacher: {
              email: teacherEmail,
            },
          },
      select: {
        id: true,
        name: true,
        code: true,
        teacherId: true,
        createdAt: true,
        students: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ name: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(
      classrooms.map((classroom: {
        id: string;
        name: string;
        code: string;
        teacherId: string;
        createdAt: Date;
        students: Array<{ id: string }>;
      }) => ({
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        teacherId: classroom.teacherId,
        studentCount: classroom.students.length,
        createdAt: classroom.createdAt,
      }))
    );
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch classrooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const teacherEmail = typeof body?.teacherEmail === "string" ? body.teacherEmail.trim() : "";
    const teacherId = typeof body?.teacherId === "string" ? body.teacherId.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const requestedCode = typeof body?.code === "string" ? body.code.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Classroom name is required" },
        { status: 400 }
      );
    }

    if (!teacherEmail && !teacherId) {
      return NextResponse.json(
        { error: "teacherEmail or teacherId is required" },
        { status: 400 }
      );
    }

    const teacher = teacherId
      ? await prisma.teacher.findUnique({ where: { id: teacherId }, select: { id: true } })
      : await prisma.teacher.findUnique({ where: { email: teacherEmail }, select: { id: true } });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    let finalCode = normalizeCode(requestedCode);
    if (!finalCode) {
      finalCode = buildClassroomCode(name);
    }

    const duplicate = await prisma.classroom.findUnique({
      where: {
        teacherId_code: {
          teacherId: teacher.id,
          code: finalCode,
        },
      },
      select: { id: true },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: "This classroom code is already in use for your account" },
        { status: 409 }
      );
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        code: finalCode,
        teacherId: teacher.id,
      },
      select: {
        id: true,
        name: true,
        code: true,
        teacherId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        ...classroom,
        studentCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating classroom:", error);
    return NextResponse.json(
      { error: "Failed to create classroom" },
      { status: 500 }
    );
  }
}
