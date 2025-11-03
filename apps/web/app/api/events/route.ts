import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const cohort = searchParams.get('cohort'); // 'control' or 'treatment'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const simulationId = searchParams.get('simulationId');
    const isSimulated = searchParams.get('isSimulated');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    
    if (type) where.type = type;
    if (userId) where.userId = userId;
    if (simulationId) where.simulationId = simulationId;
    if (isSimulated !== null) where.isSimulated = isSimulated === 'true';
    
    // Cohort filtering via metadata
    if (cohort) {
      where.metadata = {
        path: ['cohort'],
        equals: cohort
      };
    }
    
    // Date range filtering
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Query with pagination
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isSimulated: true,
              simulationId: true,
            }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    return NextResponse.json({
      events,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

