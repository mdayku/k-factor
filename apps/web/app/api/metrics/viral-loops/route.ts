import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface LoopMetrics {
  loop: string;
  displayName: string;
  invitesSent: number;
  invitesOpened: number;
  conversions: number;
  openRate: number;
  conversionRate: number;
  kFactor: number;
  cohort: 'control' | 'treatment';
}

/**
 * GET /api/metrics/viral-loops
 * Returns per-loop funnel metrics for dashboard cards
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const simulationId = searchParams.get('simulationId') || undefined;

    // Base filter
    const baseWhere: any = {
      isSimulated: true,
    };

    if (simulationId) {
      baseWhere.simulationId = simulationId;
    }

    // Get control and treatment loops
    const controlLoops = await calculateLoopMetrics(baseWhere, 'control');
    const treatmentLoops = await calculateLoopMetrics(baseWhere, 'treatment');

    return NextResponse.json({
      control: controlLoops,
      treatment: treatmentLoops,
    });
  } catch (error) {
    console.error('Error calculating viral loop metrics:', error);
    return NextResponse.json(
      { error: 'Failed to calculate viral loop metrics' },
      { status: 500 }
    );
  }
}

async function calculateLoopMetrics(
  baseWhere: any,
  cohort: 'control' | 'treatment'
): Promise<LoopMetrics[]> {
  const loops = cohort === 'control' 
    ? [{ key: 'traditional-referral', name: 'Traditional Referral' }]
    : [
        { key: 'buddy-challenge', name: 'Buddy Challenge' },
        { key: 'streak-rescue', name: 'Streak Rescue' },
        { key: 'study-buddy', name: 'Study Buddy' },
        { key: 'tutor-spotlight', name: 'Tutor Spotlight' },
      ];

  const metrics: LoopMetrics[] = [];

  for (const loop of loops) {
    // Count invites sent for this loop + cohort
    const invitesSent = await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'invite.sent',
        metadata: {
          path: ['loop'],
          equals: loop.key,
        },
      },
    });

    // Count invites opened (simulate with openRate from metadata)
    const inviteEvents = await prisma.event.findMany({
      where: {
        ...baseWhere,
        type: 'invite.sent',
        metadata: {
          path: ['loop'],
          equals: loop.key,
        },
      },
      select: {
        metadata: true,
      },
      take: 1000, // Sample for performance
    });

    // Calculate opened based on stored openRate in metadata
    const avgOpenRate = inviteEvents.length > 0
      ? inviteEvents.reduce((sum, e: any) => {
          const openRate = e.metadata?.loopOpenRate || 0.3;
          return sum + openRate;
        }, 0) / inviteEvents.length
      : 0.3;

    const invitesOpened = Math.floor(invitesSent * avgOpenRate);

    // Count conversions (users who signed up from this loop)
    const conversions = await prisma.event.count({
      where: {
        type: 'account.created',
        metadata: {
          path: ['referral'],
          equals: true,
        },
      },
    });

    // Calculate rates
    const openRate = invitesSent > 0 ? invitesOpened / invitesSent : 0;
    const conversionRate = invitesOpened > 0 ? conversions / invitesOpened : 0;

    // Get seed users for this cohort
    const seedUsers = await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'account.created',
        metadata: {
          path: ['referrerSignedLinkId'],
          equals: null,
        },
      },
    });

    const invitesPerUser = seedUsers > 0 ? invitesSent / seedUsers : 0;
    const kFactor = invitesPerUser * conversionRate;

    metrics.push({
      loop: loop.key,
      displayName: loop.name,
      invitesSent,
      invitesOpened,
      conversions,
      openRate,
      conversionRate,
      kFactor,
      cohort,
    });
  }

  return metrics;
}

