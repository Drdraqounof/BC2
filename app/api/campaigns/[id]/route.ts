import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/campaigns/[id] - Update a campaign
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
      goal,
      type,
      customType,
      status,
      startDate,
      endDate,
      studentIds
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (goal) updateData.goal = goal;
    if (type) updateData.type = type;
    if (customType !== undefined) updateData.customType = customType;
    if (status) updateData.status = status;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);

    // Update the campaign
    const campaign = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        studentLinks: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        },
        tasks: {
          select: { id: true, title: true }
        }
      }
    });

    // Handle student list updates if provided
    if (studentIds && Array.isArray(studentIds)) {
      // Resolve student names to IDs
      let finalStudentIds: string[] = [];
      
      // If studentIds contain names (strings with spaces), try to look them up
      if (studentIds.length > 0 && studentIds[0].includes(' ')) {
        // Parse full names and look up student IDs
        for (const fullName of studentIds) {
          const parts = fullName.trim().split(' ');
          if (parts.length >= 2) {
            const firstName = parts[0];
            const lastName = parts.slice(1).join(' ');
            
            const student = await prisma.student.findFirst({
              where: {
                firstName: { equals: firstName, mode: 'insensitive' },
                lastName: { equals: lastName, mode: 'insensitive' }
              },
              select: { id: true }
            });

            if (student) {
              finalStudentIds.push(student.id);
            }
          }
        }
      } else {
        finalStudentIds = studentIds;
      }

      // Get current student links
      const currentLinks = await prisma.campaignStudent.findMany({
        where: { campaignId: id }
      });
      const currentStudentIds = currentLinks.map(link => link.studentId);

      // Remove students no longer in the list
      const studentsToRemove = currentStudentIds.filter(
        sid => !finalStudentIds.includes(sid)
      );
      if (studentsToRemove.length > 0) {
        await prisma.campaignStudent.deleteMany({
          where: {
            campaignId: id,
            studentId: { in: studentsToRemove }
          }
        });
      }

      // Add new students
      const studentsToAdd = finalStudentIds.filter(
        sid => !currentStudentIds.includes(sid)
      );
      if (studentsToAdd.length > 0) {
        await prisma.campaignStudent.createMany({
          data: studentsToAdd.map(studentId => ({
            campaignId: id,
            studentId,
            status: 'PENDING'
          }))
        });
      }

      // Refetch to include updated student links
      const updatedCampaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          owner: {
            select: { id: true, firstName: true, lastName: true, email: true }
          },
          studentLinks: {
            include: {
              student: {
                select: { id: true, firstName: true, lastName: true }
              }
            }
          },
          tasks: {
            select: { id: true, title: true }
          }
        }
      });

      return NextResponse.json(updatedCampaign);
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE /api/campaigns/[id] - Delete a campaign
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      console.error('Campaign ID is missing or undefined');
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting campaign with ID:', id);

    // Delete related data first (cascade delete)
    await prisma.campaignStudent.deleteMany({
      where: { campaignId: id }
    });

    await prisma.campaignNote.deleteMany({
      where: { campaignId: id }
    });

    await prisma.promptTemplate.deleteMany({
      where: { campaignId: id }
    });

    await prisma.activityLog.deleteMany({
      where: { campaignId: id }
    });

    // Delete the campaign
    await prisma.campaign.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting campaign:', errorMessage);
    return NextResponse.json(
      { error: `Failed to delete campaign: ${errorMessage}` },
      { status: 500 }
    );
  }
}
