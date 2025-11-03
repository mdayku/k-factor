import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simulationId = searchParams.get('simulationId');
    const isSimulated = searchParams.get('isSimulated');

    // Build base where clause
    const baseWhere: any = {};
    if (simulationId) baseWhere.simulationId = simulationId;
    if (isSimulated !== null) baseWhere.isSimulated = isSimulated === 'true';

    // Helper function to get metrics for a cohort
    async function getCohortMetrics(cohort: string) {
      const cohortWhere = {
        ...baseWhere,
        metadata: {
          path: ['cohort'],
          equals: cohort
        }
      };

      const [
        totalUsers,
        fvmReached,
        invitesSent,
        invitesAccepted,
        accountsCreated
      ] = await Promise.all([
        // Count users in cohort (approximate from events)
        prisma.event.findMany({
          where: { ...cohortWhere, type: 'account.created' },
          select: { userId: true },
          distinct: ['userId']
        }).then(users => users.length),
        prisma.event.count({ where: { ...cohortWhere, type: 'fvm.reached' } }),
        prisma.event.count({ where: { ...cohortWhere, type: 'invite.sent' } }),
        prisma.event.count({ where: { ...cohortWhere, type: 'invite.accepted' } }),
        prisma.event.count({ where: { ...cohortWhere, type: 'account.created' } })
      ]);

      // Calculate metrics
      const fvmRate = accountsCreated > 0 ? (fvmReached / accountsCreated) * 100 : 0;
      const invitesPerUser = totalUsers > 0 ? invitesSent / totalUsers : 0;
      const conversionRate = invitesSent > 0 ? (invitesAccepted / invitesSent) * 100 : 0;
      const kFactor = (invitesPerUser) * (invitesAccepted / (invitesSent || 1));

      // Get retention metrics (simplified - using all events)
      const activeUsersD1 = await prisma.event.findMany({
        where: {
          ...cohortWhere,
          type: { in: ['session.started', 'practice.started'] },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        },
        select: { userId: true },
        distinct: ['userId']
      }).then(users => users.length);

      const activeUsersD7 = await prisma.event.findMany({
        where: {
          ...cohortWhere,
          type: { in: ['session.started', 'practice.started'] },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: { userId: true },
        distinct: ['userId']
      }).then(users => users.length);

      const d1Retention = totalUsers > 0 ? (activeUsersD1 / totalUsers) * 100 : 0;
      const d7Retention = totalUsers > 0 ? (activeUsersD7 / totalUsers) * 100 : 0;

      return {
        totalUsers,
        fvmReached,
        fvmRate,
        invitesSent,
        invitesAccepted,
        invitesPerUser,
        conversionRate,
        kFactor,
        retention: {
          d1: d1Retention,
          d7: d7Retention
        }
      };
    }

    // Get metrics for both cohorts
    const [controlMetrics, treatmentMetrics] = await Promise.all([
      getCohortMetrics('control'),
      getCohortMetrics('treatment')
    ]);

    // Calculate lifts
    const lifts = {
      kFactor: controlMetrics.kFactor > 0 
        ? ((treatmentMetrics.kFactor - controlMetrics.kFactor) / controlMetrics.kFactor) * 100 
        : 0,
      fvmRate: controlMetrics.fvmRate > 0 
        ? ((treatmentMetrics.fvmRate - controlMetrics.fvmRate) / controlMetrics.fvmRate) * 100 
        : 0,
      d1Retention: controlMetrics.retention.d1 > 0 
        ? ((treatmentMetrics.retention.d1 - controlMetrics.retention.d1) / controlMetrics.retention.d1) * 100 
        : 0,
      d7Retention: controlMetrics.retention.d7 > 0 
        ? ((treatmentMetrics.retention.d7 - controlMetrics.retention.d7) / controlMetrics.retention.d7) * 100 
        : 0,
      invitesPerUser: controlMetrics.invitesPerUser > 0 
        ? ((treatmentMetrics.invitesPerUser - controlMetrics.invitesPerUser) / controlMetrics.invitesPerUser) * 100 
        : 0
    };

    // Determine significance (simplified - just check if treatment is better)
    const isSignificant = 
      treatmentMetrics.kFactor > controlMetrics.kFactor * 1.1 && // 10% improvement
      treatmentMetrics.totalUsers >= 100 && 
      controlMetrics.totalUsers >= 100;

    return NextResponse.json({
      control: controlMetrics,
      treatment: treatmentMetrics,
      lifts,
      summary: {
        kFactorLift: lifts.kFactor,
        fvmLift: lifts.fvmRate,
        retentionLift: lifts.d7Retention,
        isSignificant,
        targetsMet: {
          kFactorAbove120: treatmentMetrics.kFactor >= 1.20,
          fvmLiftAbove20: lifts.fvmRate >= 20,
          retentionLiftAbove10: lifts.d7Retention >= 10
        }
      }
    });
  } catch (error) {
    console.error('Error comparing cohorts:', error);
    return NextResponse.json(
      { error: 'Failed to compare cohorts' },
      { status: 500 }
    );
  }
}

