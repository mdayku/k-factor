import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simulationId = searchParams.get('simulationId');
    const cohortParam = searchParams.get('cohort');
    // Viral Funnel excludes control group (only shows treatment viral loops)
    const cohort = (cohortParam === 'all' || !cohortParam) ? 'treatment' : cohortParam;
    const isSimulated = searchParams.get('isSimulated');

    // Build base where clause
    const baseWhere: any = {};
    if (simulationId) baseWhere.simulationId = simulationId;
    if (isSimulated !== null) baseWhere.isSimulated = isSimulated === 'true';
    
    // Helper to add cohort filter
    const addCohortFilter = (where: any) => {
      if (cohort) {
        return {
          ...where,
          metadata: {
            path: ['cohort'],
            equals: cohort
          }
        };
      }
      return where;
    };

    // Get funnel stages: invite.sent → invite.opened → account.created (referred only) → fvm.reached (referred only)
    const [
      invitesSent,
      invitesOpened,
      accountsCreated,
      referredUserIds,
      fvmReached
    ] = await Promise.all([
      // Step 1: Invites sent
      prisma.event.count({
        where: addCohortFilter({ ...baseWhere, type: 'invite.sent' })
      }),
      // Step 2: Invites opened
      prisma.event.count({
        where: addCohortFilter({ ...baseWhere, type: 'invite.opened' })
      }),
      // Step 3: Referred signups (account.created WITH referrerSignedLinkId)
      prisma.event.count({
        where: cohort ? {
          ...baseWhere,
          type: 'account.created',
          AND: [
            {
              metadata: {
                path: ['referrerSignedLinkId'],
                not: null
              }
            },
            {
              metadata: {
                path: ['cohort'],
                equals: cohort
              }
            }
          ]
        } : {
          ...baseWhere,
          type: 'account.created',
          metadata: {
            path: ['referrerSignedLinkId'],
            not: null
          }
        }
      }),
      // Get referred user IDs for step 4
      prisma.event.findMany({
        where: cohort ? {
          ...baseWhere,
          type: 'account.created',
          AND: [
            {
              metadata: {
                path: ['referrerSignedLinkId'],
                not: null
              }
            },
            {
              metadata: {
                path: ['cohort'],
                equals: cohort
              }
            }
          ]
        } : {
          ...baseWhere,
          type: 'account.created',
          metadata: {
            path: ['referrerSignedLinkId'],
            not: null
          }
        },
        select: { userId: true }
      }),
      // Placeholder, will calculate below
      Promise.resolve(0)
    ]);

    // Step 4: FVM reached (only for referred users)
    const referredIds = referredUserIds.map(e => e.userId).filter(Boolean);
    // Don't use addCohortFilter here - these users are already from the right cohort
    const fvmReachedCount = referredIds.length > 0 ? await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'fvm.reached',
        userId: { in: referredIds }
      }
    }) : 0;

    // Calculate cascading conversion rates (each step ÷ previous step)
    const openRate = invitesSent > 0 ? (invitesOpened / invitesSent) * 100 : 0;
    const signupRate = invitesOpened > 0 ? (accountsCreated / invitesOpened) * 100 : 0;
    const fvmRate = accountsCreated > 0 ? (fvmReachedCount / accountsCreated) * 100 : 0;
    const overallConversion = invitesSent > 0 ? (fvmReachedCount / invitesSent) * 100 : 0;

    return NextResponse.json({
      funnel: [
        {
          stage: 'invite.sent',
          count: invitesSent,
          percentage: 100,
          conversionFromPrevious: null
        },
        {
          stage: 'invite.opened',
          count: invitesOpened,
          percentage: openRate,
          conversionFromPrevious: openRate
        },
        {
          stage: 'account.created',
          count: accountsCreated,
          percentage: signupRate,
          conversionFromPrevious: signupRate
        },
        {
          stage: 'fvm.reached',
          count: fvmReachedCount,
          percentage: fvmRate,
          conversionFromPrevious: fvmRate
        }
      ],
      summary: {
        totalInvitesSent: invitesSent,
        totalFvmReached: fvmReachedCount,
        overallConversion: overallConversion,
        finalConversion: invitesSent > 0 ? (fvmReachedCount / invitesSent) * 100 : 0,
        dropoffs: {
          sentToOpened: invitesSent - invitesOpened,
          openedToSignup: invitesOpened - accountsCreated,
          signupToFvm: accountsCreated - fvmReachedCount
        }
      },
      cohort: cohort || 'all'
    });
  } catch (error) {
    console.error('Error calculating funnel:', error);
    return NextResponse.json(
      { error: 'Failed to calculate funnel' },
      { status: 500 }
    );
  }
}

