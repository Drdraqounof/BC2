import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tasks/[id] - Fetch a single task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
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

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] - Update a task
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      dueDate,
      priority,
      rubric,
      attachmentLinks,
      campaignId
    } = body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (rubric !== undefined) updateData.rubric = rubric;
    if (attachmentLinks !== undefined) updateData.attachmentLinks = attachmentLinks ? JSON.stringify(attachmentLinks) : null;
    if (campaignId !== undefined) updateData.campaignId = campaignId;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Cascade delete will handle removing related TaskAssignments
    await prisma.task.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
