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
    if (cohort) {
      baseWhere.metadata = {
        path: ['cohort'],
        equals: cohort
      };
    }

    // Get funnel stages: invite.sent → invite.opened → account.created → fvm.reached
    const [
      invitesSent,
      invitesOpened,
      accountsCreated,
      fvmReached
    ] = await Promise.all([
      prisma.event.count({
        where: { ...baseWhere, type: 'invite.sent' }
      }),
      prisma.event.count({
        where: { ...baseWhere, type: 'invite.opened' }
      }),
      prisma.event.count({
        where: { ...baseWhere, type: 'account.created' }
      }),
      prisma.event.count({
        where: { ...baseWhere, type: 'fvm.reached' }
      })
    ]);

    // Calculate conversion rates
    const openRate = invitesSent > 0 ? (invitesOpened / invitesSent) * 100 : 0;
    const signupRate = invitesOpened > 0 ? (accountsCreated / invitesOpened) * 100 : 0;
    const fvmRate = accountsCreated > 0 ? (fvmReached / accountsCreated) * 100 : 0;
    const overallConversion = invitesSent > 0 ? (fvmReached / invitesSent) * 100 : 0;

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
          percentage: invitesSent > 0 ? (invitesOpened / invitesSent) * 100 : 0,
          conversionFromPrevious: openRate
        },
        {
          stage: 'account.created',
          count: accountsCreated,
          percentage: invitesSent > 0 ? (accountsCreated / invitesSent) * 100 : 0,
          conversionFromPrevious: signupRate
        },
        {
          stage: 'fvm.reached',
          count: fvmReached,
          percentage: invitesSent > 0 ? (fvmReached / invitesSent) * 100 : 0,
          conversionFromPrevious: fvmRate
        }
      ],
      summary: {
        totalInvitesSent: invitesSent,
        totalFvmReached: fvmReached,
        overallConversion: overallConversion,
        dropoffs: {
          sentToOpened: invitesSent - invitesOpened,
          openedToSignup: invitesOpened - accountsCreated,
          signupToFvm: accountsCreated - fvmReached
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

