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
  accountsCreated: number;
  fvmReached: number;
  openRate: number;
  conversionRate: number;
  fvmRate: number;
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

  // Get seed users for this cohort (for K-factor calculation)
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

  for (const loop of loops) {
    // Get all invite events for this loop to extract stored rates
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
    });

    const invitesSent = inviteEvents.length;

    // Calculate average rates from stored metadata (simulation parameters)
    const avgOpenRate = inviteEvents.length > 0
      ? inviteEvents.reduce((sum, e: any) => {
          const openRate = e.metadata?.loopOpenRate || 0.3;
          return sum + openRate;
        }, 0) / inviteEvents.length
      : 0.3;

    const avgConversionRate = inviteEvents.length > 0
      ? inviteEvents.reduce((sum, e: any) => {
          const conversionRate = e.metadata?.loopConversionRate || 0.25;
          return sum + conversionRate;
        }, 0) / inviteEvents.length
      : 0.25;

    // Apply rates to calculate funnel progression
    const invitesOpened = Math.round(invitesSent * avgOpenRate);
    const accountsCreated = Math.round(invitesOpened * avgConversionRate);
    
    // FVM rate: assume 52% reach FVM (from overall funnel: 1116/2156 ≈ 52%)
    const fvmReached = Math.round(accountsCreated * 0.52);

    // Calculate rates
    const openRate = invitesSent > 0 ? invitesOpened / invitesSent : 0;
    const conversionRate = invitesOpened > 0 ? accountsCreated / invitesOpened : 0;
    const fvmRate = accountsCreated > 0 ? fvmReached / accountsCreated : 0;

    // K-factor = (invites per seed user) × (conversion rate)
    const invitesPerUser = seedUsers > 0 ? invitesSent / seedUsers : 0;
    const kFactor = invitesPerUser * conversionRate;

    metrics.push({
      loop: loop.key,
      displayName: loop.name,
      invitesSent,
      invitesOpened,
      accountsCreated,
      fvmReached,
      openRate,
      conversionRate,
      fvmRate,
      kFactor,
      cohort,
    });
  }

  return metrics;
}

