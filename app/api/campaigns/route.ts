import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/campaigns - Fetch all campaigns
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');

    const where: any = {};

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (status) {
      where.status = status;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      goal,
      type = 'CUSTOM',
      customType,
      ownerId,
      studentIds = [],
      status = 'DRAFT',
      startDate,
      endDate
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (studentIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one student must be selected' },
        { status: 400 }
      );
    }

    // TODO: Get real ownerId from authenticated user
    // For now, use a default teacher or get from request headers
    let finalOwnerId = ownerId;
    
    if (!finalOwnerId) {
      // Try to get a default teacher, or create placeholder
      let defaultTeacher = await prisma.teacher.findFirst({
        select: { id: true }
      });

      if (!defaultTeacher) {
        return NextResponse.json(
          { error: 'No teacher found. Please ensure a teacher account exists.' },
          { status: 400 }
        );
      }

      finalOwnerId = defaultTeacher.id;
    }

    const matchingStudents = await prisma.student.findMany({
      where: {
        id: {
          in: studentIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (matchingStudents.length !== studentIds.length) {
      return NextResponse.json(
        { error: 'One or more selected students could not be found' },
        { status: 400 }
      );
    }

    // Create the campaign
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        goal,
        type,
        customType,
        ownerId: finalOwnerId,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        studentLinks: {
          create: studentIds.map((studentId: string) => ({
            studentId,
            status: 'PENDING'
          }))
        }
      },
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

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create campaign: ${errorMessage}` },
      { status: 500 }
    );
  }
}
