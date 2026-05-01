import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type StudentRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: StudentRouteContext
) {
  try {
    const { id } = await params;

    const student = await prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        gradeLabel: true,
        classroomCode: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: StudentRouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { newPassword, teacherPassword } = body;

    // Validate required fields
    if (!newPassword || !teacherPassword) {
      return NextResponse.json(
        { error: "Missing required fields (newPassword, teacherPassword)" },
        { status: 400 }
      );
    }

    // In a real app, verify the teacher's password
    // For now, we'll accept any non-empty teacher password
    // In production, you'd verify against the logged-in teacher's credentials

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update student password
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully", student: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: StudentRouteContext
) {
  try {
    const { id } = await params;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Delete the student
    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Student deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
