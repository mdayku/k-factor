import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simulationId = searchParams.get('simulationId');
    const cohort = searchParams.get('cohort'); // 'control' or 'treatment'
    const isSimulated = searchParams.get('isSimulated');

    // Build base where clause
    const baseWhere: any = {};
    if (simulationId) baseWhere.simulationId = simulationId;
    if (isSimulated !== null) baseWhere.isSimulated = isSimulated === 'true';

    // Calculate K-factor: K = (invites per user) × (invite conversion rate)
    
    // Get invite.sent events
    const invitesSent = await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'invite.sent',
        ...(cohort && {
          metadata: {
            path: ['cohort'],
            equals: cohort
          }
        })
      }
    });

    // Get account.created events (conversions from invites)
    // These are new users who signed up after opening an invite
    const invitesAccepted = await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'account.created',
        AND: [
          {
            metadata: {
              path: ['referrerSignedLinkId'],
              not: null
            }
          },
          ...(cohort ? [{
            metadata: {
              path: ['cohort'],
              equals: cohort
            }
          }] : [])
        ]
      }
    });

    // Get total users
    const totalUsers = await prisma.user.count({
      where: {
        ...(simulationId && { simulationId }),
        ...(isSimulated !== null && { isSimulated: isSimulated === 'true' })
      }
    });

    // Calculate metrics
    const invitesPerUser = totalUsers > 0 ? invitesSent / totalUsers : 0;
    const inviteConversionRate = invitesSent > 0 ? invitesAccepted / invitesSent : 0;
    const kFactor = invitesPerUser * inviteConversionRate;

    // Get breakdown by cohort if not specified
    let cohortBreakdown = null;
    if (!cohort) {
      const controlInvitesSent = await prisma.event.count({
        where: {
          ...baseWhere,
          type: 'invite.sent',
          metadata: {
            path: ['cohort'],
            equals: 'control'
          }
        }
      });

      const controlInvitesAccepted = await prisma.event.count({
        where: {
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
                equals: 'control'
              }
            }
          ]
        }
      });

      const treatmentInvitesSent = await prisma.event.count({
        where: {
          ...baseWhere,
          type: 'invite.sent',
          metadata: {
            path: ['cohort'],
            equals: 'treatment'
          }
        }
      });

      const treatmentInvitesAccepted = await prisma.event.count({
        where: {
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
                equals: 'treatment'
              }
            }
          ]
        }
      });

      const usersPerCohort = totalUsers / 2; // Assuming equal split

      const controlInvitesPerUser = usersPerCohort > 0 ? controlInvitesSent / usersPerCohort : 0;
      const controlConversionRate = controlInvitesSent > 0 ? controlInvitesAccepted / controlInvitesSent : 0;
      const controlK = controlInvitesPerUser * controlConversionRate;

      const treatmentInvitesPerUser = usersPerCohort > 0 ? treatmentInvitesSent / usersPerCohort : 0;
      const treatmentConversionRate = treatmentInvitesSent > 0 ? treatmentInvitesAccepted / treatmentInvitesSent : 0;
      const treatmentK = treatmentInvitesPerUser * treatmentConversionRate;

      cohortBreakdown = {
        control: {
          invitesSent: controlInvitesSent,
          invitesAccepted: controlInvitesAccepted,
          invitesPerUser: controlInvitesPerUser,
          conversionRate: controlConversionRate,
          kFactor: controlK
        },
        treatment: {
          invitesSent: treatmentInvitesSent,
          invitesAccepted: treatmentInvitesAccepted,
          invitesPerUser: treatmentInvitesPerUser,
          conversionRate: treatmentConversionRate,
          kFactor: treatmentK
        },
        lift: controlK > 0 ? ((treatmentK - controlK) / controlK * 100) : 0
      };
    }

    return NextResponse.json({
      kFactor,
      invitesPerUser,
      inviteConversionRate,
      invitesSent,
      invitesAccepted,
      totalUsers,
      cohort: cohort || 'all',
      ...(cohortBreakdown && { cohortBreakdown })
    });
  } catch (error) {
    console.error('Error calculating K-factor:', error);
    return NextResponse.json(
      { error: 'Failed to calculate K-factor' },
      { status: 500 }
    );
  }
}

