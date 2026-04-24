import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/tasks/[id]/complete - Mark task as complete/incomplete for a student
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { studentId, grade, isComplete = true } = body;

    if (!studentId) {
      return NextResponse.json(
        { error: 'studentId is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (isComplete) {
      updateData.completedAt = new Date();
    } else {
      updateData.completedAt = null;
    }

    if (grade !== undefined) {
      updateData.grade = grade;
    }

    const assignment = await prisma.taskAssignment.update({
      where: {
        taskId_studentId: {
          taskId: params.id,
          studentId
        }
      },
      data: updateData,
      include: {
        task: {
          include: {
            creator: {
              select: { id: true, firstName: true, lastName: true, email: true }
            },
            campaign: {
              select: { id: true, title: true }
            }
          }
        },
        student: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}
