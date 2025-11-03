import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simulationId = searchParams.get('simulationId');
    const cohort = searchParams.get('cohort');
    const isSimulated = searchParams.get('isSimulated');

    // Build base where clause
    const baseWhere: any = {};
    if (simulationId) baseWhere.simulationId = simulationId;
    if (isSimulated !== null) baseWhere.isSimulated = isSimulated === 'true';

    // Get all account.created events
    const accountCreatedEvents = await prisma.event.findMany({
      where: {
        ...baseWhere,
        type: 'account.created',
        ...(cohort && {
          metadata: {
            path: ['cohort'],
            equals: cohort
          }
        })
      },
      select: {
        userId: true,
        createdAt: true
      }
    });

    // Calculate retention for D1, D7, D28
    const retentionMetrics = {
      d1: { retained: 0, total: 0, rate: 0 },
      d7: { retained: 0, total: 0, rate: 0 },
      d28: { retained: 0, total: 0, rate: 0 }
    };

    for (const event of accountCreatedEvents) {
      if (!event.userId) continue;

      const signupDate = event.createdAt;
      
      // Check for activity on D1, D7, D28
      const [d1Activity, d7Activity, d28Activity] = await Promise.all([
        // D1: 24 hours after signup
        prisma.event.count({
          where: {
            userId: event.userId,
            type: { in: ['session.started', 'practice.started', 'results.viewed'] },
            createdAt: {
              gte: new Date(signupDate.getTime() + 20 * 60 * 60 * 1000), // 20h
              lte: new Date(signupDate.getTime() + 28 * 60 * 60 * 1000)  // 28h
            }
          }
        }),
        // D7: 7 days after signup (±12h)
        prisma.event.count({
          where: {
            userId: event.userId,
            type: { in: ['session.started', 'practice.started', 'results.viewed'] },
            createdAt: {
              gte: new Date(signupDate.getTime() + 6.5 * 24 * 60 * 60 * 1000),
              lte: new Date(signupDate.getTime() + 7.5 * 24 * 60 * 60 * 1000)
            }
          }
        }),
        // D28: 28 days after signup (±24h)
        prisma.event.count({
          where: {
            userId: event.userId,
            type: { in: ['session.started', 'practice.started', 'results.viewed'] },
            createdAt: {
              gte: new Date(signupDate.getTime() + 27 * 24 * 60 * 60 * 1000),
              lte: new Date(signupDate.getTime() + 29 * 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      retentionMetrics.d1.total++;
      retentionMetrics.d7.total++;
      retentionMetrics.d28.total++;

      if (d1Activity > 0) retentionMetrics.d1.retained++;
      if (d7Activity > 0) retentionMetrics.d7.retained++;
      if (d28Activity > 0) retentionMetrics.d28.retained++;
    }

    // Calculate rates
    retentionMetrics.d1.rate = retentionMetrics.d1.total > 0 
      ? (retentionMetrics.d1.retained / retentionMetrics.d1.total) * 100 
      : 0;
    retentionMetrics.d7.rate = retentionMetrics.d7.total > 0 
      ? (retentionMetrics.d7.retained / retentionMetrics.d7.total) * 100 
      : 0;
    retentionMetrics.d28.rate = retentionMetrics.d28.total > 0 
      ? (retentionMetrics.d28.retained / retentionMetrics.d28.total) * 100 
      : 0;

    return NextResponse.json({
      retention: {
        d1: {
          retained: retentionMetrics.d1.retained,
          total: retentionMetrics.d1.total,
          rate: retentionMetrics.d1.rate
        },
        d7: {
          retained: retentionMetrics.d7.retained,
          total: retentionMetrics.d7.total,
          rate: retentionMetrics.d7.rate
        },
        d28: {
          retained: retentionMetrics.d28.retained,
          total: retentionMetrics.d28.total,
          rate: retentionMetrics.d28.rate
        }
      },
      cohort: cohort || 'all'
    });
  } catch (error) {
    console.error('Error calculating retention:', error);
    return NextResponse.json(
      { error: 'Failed to calculate retention' },
      { status: 500 }
    );
  }
}

