import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { firstName, lastName, email, school } = body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Find the teacher
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another teacher
    if (email !== teacher.email) {
      const existingTeacher = await prisma.teacher.findUnique({
        where: { email },
      });
      if (existingTeacher) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Update the teacher
    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        // Only update school if provided and not empty
        ...(school
          ? {
              school: {
                connectOrCreate: {
                  where: { name: school },
                  create: { name: school },
                },
              },
            }
          : {}),
      },
      include: { school: true },
    });

    return NextResponse.json(updatedTeacher);
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
      { status: 500 }
    );
  }
}
