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

  for (const loop of loops) {
    // 1. Get invite.sent events for this loop in this cohort
    // Extract signedLinkIds to trace the funnel
    const inviteSentEvents = await prisma.event.findMany({
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
    const invitesSent = inviteSentEvents.length;
    
    // Extract signedLinkIds from invite.sent events
    const signedLinkIds = inviteSentEvents
      .map((e: any) => e.metadata?.signedLinkId)
      .filter(Boolean) as string[];

    // 2. Count invite.opened events for these signedLinkIds
    const invitesOpened = signedLinkIds.length > 0 ? await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'invite.opened',
        metadata: {
          path: ['signedLinkId'],
          in: signedLinkIds,
        },
      },
    }) : 0;

    // 3. Get account.created events where referrerSignedLinkId matches
    const accountCreatedEvents = signedLinkIds.length > 0 ? await prisma.event.findMany({
      where: {
        ...baseWhere,
        type: 'account.created',
        metadata: {
          path: ['referrerSignedLinkId'],
          in: signedLinkIds,
        },
      },
      select: {
        userId: true,
      },
    }) : [];
    
    const accountsCreated = accountCreatedEvents.length;
    const referredUserIds = accountCreatedEvents
      .map(e => e.userId)
      .filter(Boolean) as string[];

    // 4. Count FVM (session.start with questionsAnswered > 0) for referred users
    const fvmReached = referredUserIds.length > 0 ? await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'session.start',
        userId: {
          in: referredUserIds,
        },
        metadata: {
          path: ['questionsAnswered'],
          gt: 0,
        },
      },
    }) : 0;

    // Calculate cascading percentages (each step ÷ previous step)
    const openRate = invitesSent > 0 ? invitesOpened / invitesSent : 0;
    const conversionRate = invitesOpened > 0 ? accountsCreated / invitesOpened : 0;
    const fvmRate = accountsCreated > 0 ? fvmReached / accountsCreated : 0;

    // Final conversion rate (FVM / Invites Sent)
    const finalConversionRate = invitesSent > 0 ? fvmReached / invitesSent : 0;

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
      kFactor: finalConversionRate, // Use this field for final conversion rate
      cohort,
    });
  }

  return metrics;
}

