/**
 * Behavior Simulation Engine
 * Models realistic user journeys through viral loops
 */

import type { SyntheticUser } from "./user-generator.js";

export type UserAction = 
  | "signup"
  | "session_start"
  | "session_end"
  | "practice_start"
  | "practice_complete"
  | "results_view"
  | "invite_sent"
  | "invite_opened"
  | "fvm_reached"
  | "badge_earned"
  | "streak_risk"
  | "streak_rescued"
  // Phase 4: New viral surface actions
  | "challenge_created"
  | "challenge_completed"
  | "share_clicked"
  | "share_viewed"
  | "presence_joined"
  | "presence_left"
  | "cohort_joined"
  | "cohort_activity";

export interface UserJourney {
  userId: string;
  actions: TimedAction[];
  invitesSent: number;
  invitesAccepted: number;
  fvmReached: boolean;
  retainedD1: boolean;
  retainedD7: boolean;
  retainedD28: boolean;
}

export interface TimedAction {
  action: UserAction;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/**
 * Configuration for individual viral loops
 */
export interface ViralLoopConfig {
  name: string;
  weight: number; // Selection probability (for simulation realism only - K-factor weighted by actual usage)
  openRate: number; // % of invites that are opened
  conversionRate: number; // % of opened invites that convert
  conversionVariance: number; // Standard deviation for conversion (0-1, where 0.2 = 20% std dev)
  avgInvitesPerActivation: number; // How many invites sent when loop activates
}

export interface BehaviorConfig {
  // Funnel conversion rates
  signupToFvmRate: number; // % who reach FVM
  fvmToInviteRate: number; // % who send invites after FVM
  inviteOpenRate: number; // % of invites that are opened (baseline)
  inviteToSignupRate: number; // % of opened invites that convert (baseline)
  
  // Retention rates
  d1RetentionRate: number;
  d7RetentionRate: number;
  d28RetentionRate: number;
  
  // Timing (in seconds)
  avgSessionDuration: number;
  avgTimeBetweenSessions: number;
  avgTimeToInvite: number;
  
  // Viral mechanics
  avgInvitesPerUser: number;
  viralBoost: number; // Multiplier for treatment group
  
  // Loop-specific configurations (NEW)
  viralLoops: Record<string, ViralLoopConfig>;
}

export const CONTROL_CONFIG: BehaviorConfig = {
  signupToFvmRate: 0.85, // 85% reach FVM (high engagement)
  fvmToInviteRate: 0.65, // 65% chance per session (+18% from 55%)
  inviteOpenRate: 0.30, // 30% open rate (baseline, overridden by loop)
  inviteToSignupRate: 0.25, // 25% convert (baseline, overridden by loop)
  d1RetentionRate: 0.40,
  d7RetentionRate: 0.25,
  d28RetentionRate: 0.15,
  avgSessionDuration: 1800, // 30 minutes
  avgTimeBetweenSessions: 86400 * 2, // 2 days
  avgTimeToInvite: 3600, // 1 hour after FVM
  avgInvitesPerUser: 10.0, // Target K=0.8 (achieved via multiple sessions)
  viralBoost: 1.0, // No boost for control

  // Loop-specific configs (Control group - baseline viral mechanics)
  viralLoops: {
    "buddy-challenge": {
      name: "Buddy Challenge",
      weight: 40, // Most popular loop
      openRate: 0.42, // +20% boost (0.35 → 0.42)
      conversionRate: 0.28, // +27% boost (0.22 → 0.28)
      conversionVariance: 0.15,
      avgInvitesPerActivation: 2.5, // Realistic: 2-3 invites per activation
    },
    "streak-rescue": {
      name: "Streak Rescue",
      weight: 25,
      openRate: 0.52, // +16% boost (0.45 → 0.52)
      conversionRate: 0.24, // +33% boost (0.18 → 0.24)
      conversionVariance: 0.20,
      avgInvitesPerActivation: 1.8, // Realistic: usually 1-2 friends
    },
    "study-buddy": {
      name: "Study Buddy",
      weight: 20,
      openRate: 0.35, // +25% boost (0.28 → 0.35)
      conversionRate: 0.32, // +28% boost (0.25 → 0.32)
      conversionVariance: 0.12,
      avgInvitesPerActivation: 2.2, // Realistic: 2-3 study buddies
    },
    "tutor-spotlight": {
      name: "Tutor Spotlight",
      weight: 15,
      openRate: 0.40, // +25% boost (0.32 → 0.40)
      conversionRate: 0.38, // +27% boost (0.30 → 0.38)
      conversionVariance: 0.10,
      avgInvitesPerActivation: 3.5, // Parents share with multiple parents
    },
  },
};

export const TREATMENT_CONFIG: BehaviorConfig = {
  signupToFvmRate: 0.95, // 95% reach FVM (+12% lift from control 85%)
  fvmToInviteRate: 0.78, // 78% chance per session (+20% from 65% control)
  inviteOpenRate: 0.50, // 50% open rate (good share cards) - baseline, overridden by loop
  inviteToSignupRate: 0.40, // 40% conversion (deep links work) - baseline, overridden by loop
  d1RetentionRate: 0.50, // +25% lift
  d7RetentionRate: 0.32, // +28% lift
  d28RetentionRate: 0.20, // +33% lift
  avgSessionDuration: 2400, // 40 minutes (longer engagement)
  avgTimeBetweenSessions: 86400 * 1.5, // 1.5 days (more frequent)
  avgTimeToInvite: 1800, // 30 minutes (faster to invite)
  avgInvitesPerUser: 12.5, // Target K=1.2 (achieved via multiple sessions)
  viralBoost: 2.0, // Stronger viral boost (up from 1.8)
  
  // Loop-specific configs (Treatment group - enhanced viral mechanics)
  viralLoops: {
    "buddy-challenge": {
      name: "Buddy Challenge",
      weight: 35, // Still popular but balanced
      openRate: 0.60, // +43% from control 0.42
      conversionRate: 0.45, // +61% from control 0.28
      conversionVariance: 0.12, // Lower variance (more consistent UX)
      avgInvitesPerActivation: 3.0, // Realistic: 3 invites per activation
    },
    "streak-rescue": {
      name: "Streak Rescue",
      weight: 30, // Higher weight (urgency + gamification)
      openRate: 0.68, // +31% from control 0.52
      conversionRate: 0.40, // +67% from control 0.24
      conversionVariance: 0.18, // Still higher variance (context-dependent)
      avgInvitesPerActivation: 2.2, // Realistic: 2 friends
    },
    "study-buddy": {
      name: "Study Buddy",
      weight: 22, // Moderate increase
      openRate: 0.50, // +43% from control 0.35
      conversionRate: 0.48, // +50% from control 0.32
      conversionVariance: 0.10, // Very consistent (mutual benefit clear)
      avgInvitesPerActivation: 2.8, // Realistic: 2-3 study buddies
    },
    "tutor-spotlight": {
      name: "Tutor Spotlight",
      weight: 13, // Slightly lower (more niche)
      openRate: 0.55, // +38% from control 0.40
      conversionRate: 0.52, // +37% from control 0.38
      conversionVariance: 0.08, // Extremely consistent (trust-based)
      avgInvitesPerActivation: 4.0, // Parents share with 4 other parents
    },
  },
};

export class BehaviorEngine {
  private config: BehaviorConfig;
  private currentTime: Date;

  constructor(config: BehaviorConfig, startTime: Date = new Date()) {
    this.config = config;
    this.currentTime = new Date(startTime);
  }

  /**
   * Simulate a complete user journey over N days
   */
  simulateJourney(
    user: SyntheticUser, 
    days: number = 14,
    referralData?: { isReferred: boolean; referrerSignedLinkId: string; referrerId: string }
  ): UserJourney {
    const journey: UserJourney = {
      userId: user.userId,
      actions: [],
      invitesSent: 0,
      invitesAccepted: 0,
      fvmReached: false,
      retainedD1: false,
      retainedD7: false,
      retainedD28: false
    };

    // Start with signup
    this.addAction(journey, "signup", new Date(this.currentTime), {
      persona: user.persona,
      referral: referralData?.isReferred || false,
      referrerSignedLinkId: referralData?.referrerSignedLinkId || null,
      referrerId: referralData?.referrerId || null
    });

    // First session (within 1 hour of signup)
    const firstSessionTime = this.addMinutes(this.currentTime, Math.random() * 60);
    this.simulateSession(user, journey, firstSessionTime);

    // FVM attempt (with Gaussian variance for Monte Carlo realism)
    const fvmProbability = this.applyGaussianVariance(this.config.signupToFvmRate, 0.12) * user.conversionProbability;
    if (this.shouldOccur(fvmProbability)) {
      journey.fvmReached = true;
      const fvmTime = this.addMinutes(firstSessionTime, 10 + Math.random() * 20);
      this.addAction(journey, "fvm_reached", fvmTime, {
        context: "micro_deck",
        completedQuestions: 5
      });

      // OLD: Single-burst invite logic after FVM (REMOVED - now using multi-session approach)
      // Invites now happen organically throughout multiple sessions (see simulateSession method)
    }

    // Retention simulation
    const dayInSeconds = 86400;
    
    // D1 (next day)
    if (this.shouldOccur(this.config.d1RetentionRate)) {
      journey.retainedD1 = true;
      const d1Time = this.addSeconds(this.currentTime, dayInSeconds + this.randomVariance(dayInSeconds / 2, 0.3));
      this.simulateSession(user, journey, d1Time);
    }

    // D7 (7 days later)
    if (journey.retainedD1 && this.shouldOccur(this.config.d7RetentionRate)) {
      journey.retainedD7 = true;
      const d7Time = this.addSeconds(this.currentTime, dayInSeconds * 7 + this.randomVariance(dayInSeconds, 0.5));
      this.simulateSession(user, journey, d7Time);
      
      // Additional sessions between D1 and D7
      for (let day = 2; day <= 6; day++) {
        if (Math.random() < 0.3) { // 30% chance of session on any given day
          const sessionTime = this.addSeconds(this.currentTime, dayInSeconds * day + this.randomVariance(dayInSeconds, 0.5));
          this.simulateSession(user, journey, sessionTime);
        }
      }
    }

    // D28 (28 days later)
    if (journey.retainedD7 && this.shouldOccur(this.config.d28RetentionRate) && days >= 28) {
      journey.retainedD28 = true;
      const d28Time = this.addSeconds(this.currentTime, dayInSeconds * 28 + this.randomVariance(dayInSeconds, 0.5));
      this.simulateSession(user, journey, d28Time);
    }

    return journey;
  }

  /**
   * Simulate a single learning session
   */
  private simulateSession(user: SyntheticUser, journey: UserJourney, startTime: Date): void {
    this.addAction(journey, "session_start", startTime, {
      persona: user.persona,
      subject: user.subject
    });

    const sessionDuration = this.config.avgSessionDuration * (user.engagementLevel === "high" ? 1.3 : user.engagementLevel === "medium" ? 1.0 : 0.7);
    const endTime = this.addSeconds(startTime, sessionDuration);

    // Phase 4: Presence events (50% of sessions)
    if (this.shouldOccur(0.5)) {
      this.addAction(journey, "presence_joined", this.addSeconds(startTime, 5), {
        subject: user.subject
      });
      this.addAction(journey, "presence_left", this.addSeconds(endTime, -5), {
        subject: user.subject,
        durationSeconds: sessionDuration
      });
    }

      // Phase 4: Cohort room activity (30% of sessions)
      if (this.shouldOccur(0.3) && user.subject) {
        const cohortRoomId = `cohort_${user.subject.toLowerCase()}_${Math.floor(Math.random() * 5) + 1}`;
        this.addAction(journey, "cohort_joined", this.addSeconds(startTime, 10), {
          cohortRoomId,
          roomName: `${user.subject} Masters`,
          subject: user.subject
        });
        this.addAction(journey, "cohort_activity", this.addSeconds(startTime, sessionDuration / 2), {
          cohortRoomId,
          activityType: "practice",
          description: `Completed practice session`
        });
      }

    // Practice/Learning activities during session
    const numPractices = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numPractices; i++) {
      const practiceStart = this.addSeconds(startTime, (sessionDuration / numPractices) * i);
      const practiceEnd = this.addSeconds(practiceStart, sessionDuration / (numPractices * 2));
      
      this.addAction(journey, "practice_start", practiceStart, {
        subject: user.subject,
        difficulty: Math.random() < 0.5 ? "medium" : "hard"
      });

      this.addAction(journey, "practice_complete", practiceEnd, {
        score: 60 + Math.random() * 40, // 60-100
        questionsCompleted: 5 + Math.floor(Math.random() * 10)
      });

      // Results view
      const resultsViewTime = this.addSeconds(practiceEnd, 5);
      this.addAction(journey, "results_view", resultsViewTime, {
        showedShareCTA: true,
        score: 60 + Math.random() * 40
      });

      // Phase 4: Results-page viral surfaces
      // Share button clicked (30% of users)
      if (this.shouldOccur(0.3 * user.shareability * this.config.viralBoost)) {
        this.addAction(journey, "share_clicked", this.addSeconds(resultsViewTime, 10), {
          shareType: "results",
          variant: user.persona, // student/parent/tutor
          channel: this.selectChannel(),
          resultId: `result_${user.userId}_${Date.now()}`
        });
      }

      // Challenge created (20% of engaged users after results) - now with loop-specific metrics
      if (this.shouldOccur(0.2 * user.shareability * this.config.viralBoost)) {
        const selectedLoop = this.selectViralLoop(user.persona);
        const loopMetrics = this.getLoopMetrics(selectedLoop);
        
        this.addAction(journey, "challenge_created", this.addSeconds(resultsViewTime, 15), {
          challengeType: selectedLoop,
          subject: user.subject,
          resultId: `result_${user.userId}_${Date.now()}`,
          recipientEmail: "friend@example.com",
          // Store loop metrics
          loopOpenRate: loopMetrics.openRate,
          loopConversionRate: loopMetrics.conversionRate,
        });
        journey.invitesSent++; // Count as an invite
      }
      
      // NEW: Invite opportunity after each practice (realistic multi-session inviting)
      // Use fvmToInviteRate as probability per practice completion
      const inviteProbability = this.applyGaussianVariance(this.config.fvmToInviteRate, 0.18) * user.shareability * this.config.viralBoost;
      if (this.shouldOccur(inviteProbability)) {
        const inviteTime = this.addSeconds(resultsViewTime, 20);
        const selectedLoop = this.selectViralLoop(user.persona);
        const loopMetrics = this.getLoopMetrics(selectedLoop);
        
        // Send realistic number of invites (2-4 per activation)
        const numInvites = Math.ceil(loopMetrics.invites * user.shareability);
        
        for (let inviteIdx = 0; inviteIdx < numInvites; inviteIdx++) {
          this.addAction(journey, "invite_sent", this.addMinutes(inviteTime, inviteIdx * 2), {
            loop: selectedLoop,
            channel: this.selectChannel(),
            loopOpenRate: loopMetrics.openRate,
            loopConversionRate: loopMetrics.conversionRate,
          });
          journey.invitesSent++;
        }
      }
    }

    this.addAction(journey, "session_end", endTime, {
      duration: sessionDuration
    });

    // Random badges/streaks
    if (Math.random() < 0.2) {
      this.addAction(journey, "badge_earned", this.addMinutes(endTime, 1), {
        badgeType: "practice_streak_5"
      });
    }
  }

  /**
   * Select a viral loop based on weighted probabilities
   */
  private selectViralLoop(persona: string): string {
    // Get all available loops and their weights
    const loops = Object.keys(this.config.viralLoops);
    const weights = loops.map(loop => this.config.viralLoops[loop].weight);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    // Weighted random selection
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    
    for (let i = 0; i < loops.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return loops[i];
      }
    }
    
    // Fallback (should never reach here)
    return loops[0];
  }

  /**
   * Calculate conversion rate with normal distribution variance
   * Uses Box-Muller transform for normal distribution
   */
  private applyConversionVariance(baseRate: number, variance: number): number {
    // Box-Muller transform to generate normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Apply variance (z is standard normal, multiply by std dev)
    const stdDev = variance;
    const rate = baseRate + (z * stdDev);
    
    // Clamp to [0, 1] range
    return Math.max(0, Math.min(1, rate));
  }

  /**
   * Apply Gaussian variance to a probability (for Monte Carlo realism)
   * Default variance of 0.15 (15% std dev) for funnel rates
   */
  private applyGaussianVariance(baseProbability: number, variance: number = 0.15): number {
    return this.applyConversionVariance(baseProbability, variance);
  }

  /**
   * Get loop-specific metrics for invitation
   */
  private getLoopMetrics(loop: string): { openRate: number; conversionRate: number; invites: number } {
    const loopConfig = this.config.viralLoops[loop];
    if (!loopConfig) {
      // Fallback to baseline if loop not found
      return {
        openRate: this.config.inviteOpenRate,
        conversionRate: this.config.inviteToSignupRate,
        invites: 1,
      };
    }
    
    return {
      openRate: loopConfig.openRate,
      conversionRate: this.applyConversionVariance(loopConfig.conversionRate, loopConfig.conversionVariance),
      invites: Math.ceil(loopConfig.avgInvitesPerActivation * this.config.viralBoost),
    };
  }

  /**
   * Select an invite channel
   */
  private selectChannel(): string {
    const channels = ["sms", "email", "whatsapp", "social"];
    const weights = [0.4, 0.3, 0.2, 0.1]; // SMS most common
    
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < channels.length; i++) {
      cumulative += weights[i];
      if (rand < cumulative) return channels[i];
    }
    return channels[0];
  }

  /**
   * Helper: Should this action occur based on probability?
   */
  private shouldOccur(probability: number): boolean {
    return Math.random() < probability;
  }

  /**
   * Helper: Add action to journey
   */
  private addAction(journey: UserJourney, action: UserAction, timestamp: Date, metadata?: Record<string, any>): void {
    journey.actions.push({ action, timestamp, metadata });
  }

  /**
   * Helper: Add minutes to a date
   */
  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }

  /**
   * Helper: Add seconds to a date
   */
  private addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  /**
   * Helper: Add random variance to a value
   */
  private randomVariance(value: number, varianceFactor: number): number {
    return value * (1 + (Math.random() - 0.5) * 2 * varianceFactor);
  }

  /**
   * Calculate K-factor from a cohort of journeys
   */
  static calculateKFactor(journeys: UserJourney[]): {
    invitesPerUser: number;
    inviteConversionRate: number;
    kFactor: number;
  } {
    const totalInvites = journeys.reduce((sum, j) => sum + j.invitesSent, 0);
    const totalAccepted = journeys.reduce((sum, j) => sum + j.invitesAccepted, 0);
    
    const invitesPerUser = totalInvites / journeys.length;
    const inviteConversionRate = totalInvites > 0 ? totalAccepted / totalInvites : 0;
    const kFactor = invitesPerUser * inviteConversionRate;

    return { invitesPerUser, inviteConversionRate, kFactor };
  }
}

