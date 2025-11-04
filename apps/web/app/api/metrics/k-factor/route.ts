import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * Loop-specific K-factor breakdown
 */
interface LoopMetrics {
  loop: string;
  invitesSent: number;
  invitesAccepted: number;
  invitesPerUser: number;
  conversionRate: number;
  kFactor: number;
  weight: number; // Percentage of total invites (e.g., 0.4 = 40%)
}

/**
 * Calculate K-factor breakdown by viral loop, weighted by actual usage
 */
async function calculateLoopBreakdown(
  baseWhere: any,
  cohort: string | null,
  totalUsers: number
): Promise<LoopMetrics[]> {
  const loops = ['buddy-challenge', 'streak-rescue', 'study-buddy', 'tutor-spotlight'];
  const breakdown: LoopMetrics[] = [];
  let totalInvites = 0;

  // First pass: calculate metrics per loop
  for (const loop of loops) {
    const loopInvitesSent = await prisma.event.count({
      where: {
        ...baseWhere,
        type: 'invite.sent',
        metadata: {
          path: ['loop'],
          equals: loop
        },
        ...(cohort && {
          metadata: {
            path: ['cohort'],
            equals: cohort
          }
        })
      }
    });

    // Count conversions from this loop
    // We need to trace: invite.sent (with loop) → SignedLink → account.created
    const loopInvitesAccepted = await prisma.attribution.count({
      where: {
        signedLink: {
          loop: loop,
          ...(cohort && {
            metadata: {
              path: ['cohort'],
              equals: cohort
            }
          })
        }
      }
    });

    const invitesPerUser = totalUsers > 0 ? loopInvitesSent / totalUsers : 0;
    const conversionRate = loopInvitesSent > 0 ? loopInvitesAccepted / loopInvitesSent : 0;
    const kFactor = invitesPerUser * conversionRate;

    breakdown.push({
      loop,
      invitesSent: loopInvitesSent,
      invitesAccepted: loopInvitesAccepted,
      invitesPerUser,
      conversionRate,
      kFactor,
      weight: 0, // Will be calculated in second pass
    });

    totalInvites += loopInvitesSent;
  }

  // Second pass: calculate weights based on actual usage
  for (const metrics of breakdown) {
    metrics.weight = totalInvites > 0 ? metrics.invitesSent / totalInvites : 0;
  }

  return breakdown;
}

/**
 * Calculate weighted K-factor based on actual loop usage
 * 
 * Formula: K_weighted = Σ(K_loop × weight_loop)
 * where:
 *   - K_loop = (invites_loop / total_users) × (conversions_loop / invites_loop)
 *   - weight_loop = invites_loop / total_invites
 * 
 * This ensures loops that are used more contribute more to the overall K-factor.
 * 
 * Example:
 *   If Buddy Challenge has 100 invites with K=0.5 and Streak Rescue has 50 invites with K=1.0:
 *   - Buddy Challenge weight = 100/150 = 0.67
 *   - Streak Rescue weight = 50/150 = 0.33
 *   - K_weighted = (0.5 × 0.67) + (1.0 × 0.33) = 0.335 + 0.33 = 0.665
 * 
 * This is more accurate than simple averaging, which would give (0.5 + 1.0) / 2 = 0.75
 */
function calculateWeightedKFactor(breakdown: LoopMetrics[]): number {
  return breakdown.reduce((sum, metrics) => {
    return sum + (metrics.kFactor * metrics.weight);
  }, 0);
}

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

    // Get total users AND distinguish seed vs referred users
    const totalUsers = await prisma.user.count({
      where: {
        ...(simulationId && { simulationId }),
        ...(isSimulated !== null && { isSimulated: isSimulated === 'true' })
      }
    });

    // Count seed users (users NOT referred by anyone)
    // For simulated users: Check account.created events WITHOUT referrerSignedLinkId
    // For real users: Check Attribution table
    const seedUserAccountCreatedEvents = await prisma.event.findMany({
      where: {
        ...baseWhere,
        type: 'account.created',
        metadata: {
          path: ['referrerSignedLinkId'],
          equals: null
        }
      },
      select: { userId: true },
      distinct: ['userId']
    });
    
    const seedUsers = seedUserAccountCreatedEvents.filter(e => e.userId !== null).length;

    // Count referred users (users who signed up via invites)
    // Use invitesAccepted, which counts account.created events with referrerSignedLinkId
    const referredUsers = invitesAccepted;

    // Calculate K-factor per instructions: K = (invites per user) × (invite conversion rate)
    // Using seed users in denominator to measure efficiency of original cohort
    const invitesPerUser = seedUsers > 0 ? invitesSent / seedUsers : 0;
    const inviteConversionRate = invitesSent > 0 ? invitesAccepted / invitesSent : 0;
    const kFactor = invitesPerUser * inviteConversionRate; // Simplifies to: referredUsers / seedUsers

    // Calculate K-factor breakdown by loop (weighted by actual usage)
    // Use seedUsers for proper K-factor calculation
    const loopBreakdown = await calculateLoopBreakdown(baseWhere, cohort, seedUsers);
    const weightedKFactor = calculateWeightedKFactor(loopBreakdown);

    // Get breakdown by cohort if not specified
    let cohortBreakdown = null;
    if (!cohort) {
      // Count seed users per cohort
      // Get SEED users (account.created WITHOUT referrerSignedLinkId) for each cohort
      const controlSeedUserEvents = await prisma.event.findMany({
        where: {
          ...baseWhere,
          type: 'account.created',
          AND: [
            {
              metadata: {
                path: ['cohort'],
                equals: 'control'
              }
            },
            {
              metadata: {
                path: ['referrerSignedLinkId'],
                equals: null
              }
            }
          ]
        },
        select: { userId: true },
        distinct: ['userId']
      });

      const treatmentSeedUserEvents = await prisma.event.findMany({
        where: {
          ...baseWhere,
          type: 'account.created',
          AND: [
            {
              metadata: {
                path: ['cohort'],
                equals: 'treatment'
              }
            },
            {
              metadata: {
                path: ['referrerSignedLinkId'],
                equals: null
              }
            }
          ]
        },
        select: { userId: true },
        distinct: ['userId']
      });

      const controlSeedUsers = controlSeedUserEvents.filter(e => e.userId !== null).length;
      const treatmentSeedUsers = treatmentSeedUserEvents.filter(e => e.userId !== null).length;
      
      // Calculate weighted K-factor for control group
      const controlLoopBreakdown = await calculateLoopBreakdown(baseWhere, 'control', controlSeedUsers);
      const controlWeightedK = calculateWeightedKFactor(controlLoopBreakdown);
      
      // Calculate weighted K-factor for treatment group
      const treatmentLoopBreakdown = await calculateLoopBreakdown(baseWhere, 'treatment', treatmentSeedUsers);
      const treatmentWeightedK = calculateWeightedKFactor(treatmentLoopBreakdown);
      
      // Also calculate simple K-factor for comparison
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

      // Calculate K-factor per instructions: K = (invites per user) × (invite conversion rate)
      const controlInvitesPerUser = controlSeedUsers > 0 ? controlInvitesSent / controlSeedUsers : 0;
      const controlConversionRate = controlInvitesSent > 0 ? controlInvitesAccepted / controlInvitesSent : 0;
      const controlK = controlInvitesPerUser * controlConversionRate;
      
      const treatmentInvitesPerUser = treatmentSeedUsers > 0 ? treatmentInvitesSent / treatmentSeedUsers : 0;
      const treatmentConversionRate = treatmentInvitesSent > 0 ? treatmentInvitesAccepted / treatmentInvitesSent : 0;
      const treatmentK = treatmentInvitesPerUser * treatmentConversionRate;

      cohortBreakdown = {
        control: {
          invitesSent: controlInvitesSent,
          invitesAccepted: controlInvitesAccepted,
          invitesPerUser: controlInvitesPerUser,
          conversionRate: controlConversionRate,
          kFactor: controlK, // Simple K-factor
          weightedKFactor: controlWeightedK, // Weighted by loop usage
          loopBreakdown: controlLoopBreakdown
        },
        treatment: {
          invitesSent: treatmentInvitesSent,
          invitesAccepted: treatmentInvitesAccepted,
          invitesPerUser: treatmentInvitesPerUser,
          conversionRate: treatmentConversionRate,
          kFactor: treatmentK, // Simple K-factor
          weightedKFactor: treatmentWeightedK, // Weighted by loop usage
          loopBreakdown: treatmentLoopBreakdown
        },
        lift: controlK > 0 ? ((treatmentK - controlK) / controlK * 100) : 0,
        weightedLift: controlWeightedK > 0 ? ((treatmentWeightedK - controlWeightedK) / controlWeightedK * 100) : 0
      };
    }

    return NextResponse.json({
      kFactor, // Correct K-factor: referred users / seed users
      weightedKFactor, // K-factor weighted by actual loop usage
      invitesPerUser, // Invites per seed user (not total)
      inviteConversionRate,
      invitesSent,
      invitesAccepted,
      totalUsers,
      seedUsers, // The initial cohort (existing users)
      referredUsers, // New users from referrals
      cohort: cohort || 'all',
      loopBreakdown, // Per-loop metrics with weights
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

