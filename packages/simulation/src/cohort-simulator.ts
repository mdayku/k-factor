/**
 * Cohort Simulator
 * Runs A/B experiments with control (K=0.8) vs treatment (K≥1.20) cohorts
 */

import { UserGenerator, type SyntheticUser } from "./user-generator.js";
import { BehaviorEngine, CONTROL_CONFIG, TREATMENT_CONFIG, type UserJourney } from "./behavior-engine.js";
import { EventGenerator } from "./event-generator.js";

export interface CohortConfig {
  name: string;
  size: number;
  behaviorConfig: typeof CONTROL_CONFIG;
  startDate: Date;
  durationDays: number;
}

export interface CohortResults {
  cohortName: string;
  totalUsers: number;
  
  // Funnel metrics
  signups: number;
  fvmReached: number;
  fvmRate: number;
  
  // Viral metrics
  totalInvitesSent: number;
  invitesPerUser: number;
  totalInvitesAccepted: number;
  inviteConversionRate: number;
  kFactor: number;
  
  // Retention metrics
  d1Retention: number;
  d7Retention: number;
  d28Retention: number;
  
  // Economics
  avgLTV: number;
  avgCAC: number;
  ltvCacRatio: number;
  
  // Referral mix
  organicSignups: number;
  referredSignups: number;
  referralMixPercent: number;
}

export interface ExperimentResults {
  control: CohortResults;
  treatment: CohortResults;
  
  // Comparative metrics
  kFactorLift: number; // % improvement
  fvmLift: number;
  d7RetentionLift: number;
  referralMixLift: number;
  
  // Statistical significance (simplified)
  isSignificant: boolean;
  confidenceLevel: number;
}

export class CohortSimulator {
  private userGenerator: UserGenerator;
  private eventGenerator: EventGenerator;

  constructor() {
    this.userGenerator = new UserGenerator();
    this.eventGenerator = new EventGenerator();
  }

  /**
   * Run a complete A/B experiment
   */
  runExperiment(
    controlSize: number = 500,
    treatmentSize: number = 500,
    durationDays: number = 14,
    startDate: Date = new Date()
  ): ExperimentResults {
    console.log(`\n🧪 Starting A/B Experiment...`);
    console.log(`   Control: ${controlSize} users | Treatment: ${treatmentSize} users`);
    console.log(`   Duration: ${durationDays} days\n`);

    // Run control cohort
    console.log("📊 Simulating CONTROL cohort (K target: 0.8)...");
    const controlConfig: CohortConfig = {
      name: "control",
      size: controlSize,
      behaviorConfig: CONTROL_CONFIG,
      startDate,
      durationDays
    };
    const controlResults = this.simulateCohort(controlConfig);

    // Run treatment cohort
    console.log("📊 Simulating TREATMENT cohort (K target: ≥1.20)...");
    const treatmentConfig: CohortConfig = {
      name: "treatment",
      size: treatmentSize,
      behaviorConfig: TREATMENT_CONFIG,
      startDate,
      durationDays
    };
    const treatmentResults = this.simulateCohort(treatmentConfig);

    // Calculate lifts
    const kFactorLift = ((treatmentResults.kFactor - controlResults.kFactor) / controlResults.kFactor) * 100;
    const fvmLift = ((treatmentResults.fvmRate - controlResults.fvmRate) / controlResults.fvmRate) * 100;
    const d7RetentionLift = ((treatmentResults.d7Retention - controlResults.d7Retention) / controlResults.d7Retention) * 100;
    const referralMixLift = treatmentResults.referralMixPercent - controlResults.referralMixPercent;

    // Simple statistical significance (based on sample size and effect size)
    const isSignificant = this.calculateSignificance(
      controlResults.kFactor,
      treatmentResults.kFactor,
      controlSize,
      treatmentSize
    );

    return {
      control: controlResults,
      treatment: treatmentResults,
      kFactorLift,
      fvmLift,
      d7RetentionLift,
      referralMixLift,
      isSignificant,
      confidenceLevel: isSignificant ? 0.95 : 0.80
    };
  }

  /**
   * Simulate a single cohort
   */
  simulateCohort(config: CohortConfig): CohortResults {
    // Generate users
    const users = this.userGenerator.generate(config.size, {
      fraudRate: 0.01,
      coppaMinorRate: 0.15,
      parentalConsentRate: 0.80
    });

    // Create friendship networks
    this.userGenerator.createFriendships(users, 5);

    // Assign cohort
    users.forEach(u => u.cohortId = config.name);

    // Simulate behaviors
    const behaviorEngine = new BehaviorEngine(config.behaviorConfig, config.startDate);
    const journeys: UserJourney[] = [];
    
    for (const user of users) {
      const journey = behaviorEngine.simulateJourney(user, config.durationDays);
      journeys.push(journey);

      // Generate events
      this.eventGenerator.generateEvents(user, journey);
    }

    // Simulate viral spread (referrals)
    const referredUsers = this.simulateViralSpread(users, journeys, config);

    // Calculate metrics
    return this.calculateCohortMetrics(config.name, users, journeys, referredUsers);
  }

  /**
   * Simulate viral spread: invites → new signups
   */
  private simulateViralSpread(
    users: SyntheticUser[],
    journeys: UserJourney[],
    config: CohortConfig
  ): SyntheticUser[] {
    const referredUsers: SyntheticUser[] = [];
    
    // Get all existing invite.sent events to extract their signedLinkIds
    const allEvents = this.eventGenerator.getAllEvents();
    
    for (let i = 0; i < journeys.length; i++) {
      const journey = journeys[i];
      const inviter = users[i];

      // Get all invite.sent events for this user
      const inviteSentEvents = allEvents.filter(
        e => e.type === 'invite.sent' && e.userId === inviter.userId
      );

      // For each invite sent, simulate opens and conversions using the ACTUAL signedLinkIds
      for (let inviteNum = 0; inviteNum < inviteSentEvents.length; inviteNum++) {
        const inviteEvent = inviteSentEvents[inviteNum];
        const signedLinkId = inviteEvent.metadata?.signedLinkId;
        const loop = inviteEvent.metadata?.loop || 'unknown';
        
        if (!signedLinkId) continue; // Skip if no signedLinkId
        
        // Invite opened?
        if (Math.random() < config.behaviorConfig.inviteOpenRate) {
          // Generate invite.opened event
          const openTime = new Date(config.startDate.getTime() + Math.random() * config.durationDays * 24 * 60 * 60 * 1000);
          this.eventGenerator.addRawEvent({
            type: 'invite.opened',
            ts: openTime.toISOString(),
            userId: null, // Not yet a user
            sessionId: `new_${Date.now()}_${inviteNum}`,
            surface: 'web',
            metadata: {
              signedLinkId,
              referrerId: inviter.userId,
              loop, // Pass through the viral loop name
              cohort: config.name
            }
          });
          
          // Invite converted to signup?
          if (Math.random() < config.behaviorConfig.inviteToSignupRate) {
            // Create a referred user (similar persona/demographics to inviter)
            const referredUser = this.createReferredUser(inviter, config.name);
            referredUsers.push(referredUser);
            
            // Track the conversion
            journey.invitesAccepted++;

            // Simulate the referred user's journey with referral metadata
            const referredBehavior = new BehaviorEngine(config.behaviorConfig, config.startDate);
            const referredJourney = referredBehavior.simulateJourney(referredUser, config.durationDays, {
              isReferred: true,
              referrerSignedLinkId: signedLinkId,
              referrerId: inviter.userId
            });
            
            // Generate events for referred user
            this.eventGenerator.generateEvents(referredUser, referredJourney);
          }
        }
      }
    }

    return referredUsers;
  }

  /**
   * Create a referred user similar to the inviter
   */
  private createReferredUser(inviter: SyntheticUser, cohortId: string): SyntheticUser {
    const referredUsers = this.userGenerator.generate(1, {
      fraudRate: 0.005, // Lower fraud in referrals
      coppaMinorRate: inviter.persona === "student" ? 0.20 : 0.10,
      parentalConsentRate: 0.85
    });

    const referred = referredUsers[0];
    referred.cohortId = cohortId;
    referred.persona = inviter.persona; // Same persona
    referred.subject = inviter.subject; // Same subject interest
    referred.conversionProbability *= 1.2; // Referred users convert better
    referred.shareability *= 1.15; // Referred users share more

    return referred;
  }

  /**
   * Calculate comprehensive metrics for a cohort
   */
  private calculateCohortMetrics(
    cohortName: string,
    organicUsers: SyntheticUser[],
    journeys: UserJourney[],
    referredUsers: SyntheticUser[]
  ): CohortResults {
    const allUsers = [...organicUsers, ...referredUsers];
    const totalUsers = allUsers.length;

    // Funnel metrics
    const fvmReached = journeys.filter(j => j.fvmReached).length;
    const fvmRate = fvmReached / organicUsers.length;

    // Viral metrics
    const totalInvitesSent = journeys.reduce((sum, j) => sum + j.invitesSent, 0);
    const invitesPerUser = totalInvitesSent / organicUsers.length;
    const totalInvitesAccepted = journeys.reduce((sum, j) => sum + j.invitesAccepted, 0);
    const inviteConversionRate = totalInvitesSent > 0 ? totalInvitesAccepted / totalInvitesSent : 0;
    const kFactor = invitesPerUser * inviteConversionRate;

    // Retention metrics
    const d1Retention = journeys.filter(j => j.retainedD1).length / organicUsers.length;
    const d7Retention = journeys.filter(j => j.retainedD7).length / organicUsers.length;
    const d28Retention = journeys.filter(j => j.retainedD28).length / organicUsers.length;

    // Economics
    const avgLTV = allUsers.reduce((sum, u) => sum + u.ltv, 0) / totalUsers;
    const avgCAC = allUsers.reduce((sum, u) => sum + u.cac, 0) / totalUsers;
    const ltvCacRatio = avgLTV / avgCAC;

    // Referral mix
    const organicSignups = organicUsers.length;
    const referredSignups = referredUsers.length;
    const referralMixPercent = (referredSignups / totalUsers) * 100;

    return {
      cohortName,
      totalUsers,
      signups: totalUsers,
      fvmReached,
      fvmRate,
      totalInvitesSent,
      invitesPerUser,
      totalInvitesAccepted,
      inviteConversionRate,
      kFactor,
      d1Retention,
      d7Retention,
      d28Retention,
      avgLTV,
      avgCAC,
      ltvCacRatio,
      organicSignups,
      referredSignups,
      referralMixPercent
    };
  }

  /**
   * Calculate statistical significance (simplified)
   */
  private calculateSignificance(
    controlMetric: number,
    treatmentMetric: number,
    controlSize: number,
    treatmentSize: number
  ): boolean {
    // Simplified: Consider significant if:
    // 1. Sample size >= 100 per cohort
    // 2. Treatment metric is at least 20% higher than control
    // 3. Treatment metric > 1.0 (for K-factor)
    
    const sampleSizeOk = controlSize >= 100 && treatmentSize >= 100;
    const liftPercent = ((treatmentMetric - controlMetric) / controlMetric) * 100;
    const meaningfulLift = liftPercent >= 20;
    const targetMet = treatmentMetric >= 1.0;

    return sampleSizeOk && meaningfulLift && targetMet;
  }

  /**
   * Get all generated events
   */
  getEvents() {
    return this.eventGenerator.getAllEvents();
  }

  /**
   * Clear simulation state
   */
  clear(): void {
    this.eventGenerator.clear();
  }
}

