import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/tasks/[id]/assign - Assign task to students
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { studentIds = [] } = body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'studentIds must be a non-empty array' },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get existing assignments
    const existingAssignments = await prisma.taskAssignment.findMany({
      where: { taskId: id },
      select: { studentId: true }
    });

    const existingStudentIds = existingAssignments.map(a => a.studentId);

    // Create assignments only for new students
    const newStudentIds = studentIds.filter(id => !existingStudentIds.includes(id));

    if (newStudentIds.length > 0) {
      await prisma.taskAssignment.createMany({
        data: newStudentIds.map(studentId => ({
          taskId: id,
          studentId
        }))
      });
    }

    // Fetch updated task
    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        campaign: {
          select: { id: true, title: true }
        },
        taskAssignments: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error assigning task:', error);
    return NextResponse.json(
      { error: 'Failed to assign task' },
      { status: 500 }
    );
  }
}
