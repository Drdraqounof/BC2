import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type LoginRole = "teacher" | "student";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim();
    const password = body.password;
    const role = body.role as LoginRole | undefined;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required." },
        { status: 400 }
      );
    }

    if (role === "teacher") {
      const teacher = await prisma.teacher.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!teacher || !teacher.password) {
        return NextResponse.json(
          { error: "We could not find a teacher account for this email. Please create an account before signing in." },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(password, teacher.password);

      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true, user: { id: teacher.id, email: teacher.email, role } });
    }

    if (role === "student") {
      const student = await prisma.student.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!student) {
        return NextResponse.json(
          { error: "We could not find a student account for this email. Please create an account before signing in." },
          { status: 404 }
        );
      }

      const isMatch = await bcrypt.compare(password, student.password);

      if (!isMatch) {
        return NextResponse.json(
          { error: "Incorrect password. Please try again." },
          { status: 401 }
        );
      }

      return NextResponse.json({ success: true, user: { id: student.id, email: student.email, role } });
    }

    return NextResponse.json(
      { error: "Unsupported role supplied for login." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error signing in:", error);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}