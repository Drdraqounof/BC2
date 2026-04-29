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

    // Resolve student names to IDs
    let finalStudentIds: string[] = [];
    
    // If studentIds contain names (strings with spaces), try to look them up
    // Otherwise assume they're already IDs
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
      
      if (finalStudentIds.length === 0) {
        return NextResponse.json(
          { error: 'Could not find any of the selected students in the database' },
          { status: 400 }
        );
      }
    } else {
      finalStudentIds = studentIds;
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
          create: finalStudentIds.map(studentId => ({
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
