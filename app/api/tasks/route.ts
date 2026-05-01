import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tasks - Fetch all tasks with optional filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const campaignId = searchParams.get('campaignId');
    const creatorId = searchParams.get('creatorId');
    const status = searchParams.get('status'); // 'completed' | 'pending' | 'all'

    const where: any = {};

    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }

    const tasks = await prisma.task.findMany({
      where,
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
      },
      orderBy: { dueDate: 'asc' }
    });

    // Filter by completion status if provided
    let filteredTasks = tasks;
    if (status === 'completed') {
      filteredTasks = tasks.filter((task: { taskAssignments: Array<{ completedAt: Date | null }> }) =>
        task.taskAssignments.every((assignment: { completedAt: Date | null }) => assignment.completedAt !== null)
      );
    } else if (status === 'pending') {
      filteredTasks = tasks.filter((task: { taskAssignments: Array<{ completedAt: Date | null }> }) =>
        task.taskAssignments.some((assignment: { completedAt: Date | null }) => assignment.completedAt === null)
      );
    }

    return NextResponse.json(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      dueDate,
      priority = 'MEDIUM',
      rubric,
      attachmentLinks,
      campaignId,
      creatorId,
      studentIds = []
    } = body;

    if (!title || !creatorId) {
      return NextResponse.json(
        { error: 'Title and creatorId are required' },
        { status: 400 }
      );
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        rubric,
        attachmentLinks: attachmentLinks ? JSON.stringify(attachmentLinks) : null,
        campaignId,
        creatorId
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        campaign: {
          select: { id: true, title: true }
        }
      }
    });

    // Create task assignments for selected students
    if (studentIds.length > 0) {
      await prisma.taskAssignment.createMany({
        data: studentIds.map((studentId: string) => ({
          taskId: task.id,
          studentId
        }))
      });
    }

    // Fetch the complete task with assignments
    const completeTask = await prisma.task.findUnique({
      where: { id: task.id },
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

    return NextResponse.json(completeTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
