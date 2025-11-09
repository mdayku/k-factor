/**
 * Behavior Simulation Engine
 * Models realistic user journeys through viral loops
 */

import type { SyntheticUser } from "./user-generator.js";
import { copyKit } from "copy-kit";
import type { ViralLoop, Persona } from "copy-kit";

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
  signupToFvmRate: 0.85, // 85% reach FVM
  fvmToInviteRate: 0.78, // 78% chance per session
  inviteOpenRate: 0.30, // 30% open rate (baseline, overridden by loop)
  inviteToSignupRate: 0.25, // 25% convert (baseline, overridden by loop)
  d1RetentionRate: 0.40,
  d7RetentionRate: 0.25,
  d28RetentionRate: 0.15,
  avgSessionDuration: 1800, // 30 minutes
  avgTimeBetweenSessions: 86400 * 2, // 2 days
  avgTimeToInvite: 3600, // 1 hour after FVM
  avgInvitesPerUser: 16.0, // Calibrated to hit K~0.8
  viralBoost: 1.0, // No boost for control

  // Loop-specific configs (Control group - NO viral loop features, traditional referral only)
  viralLoops: {
    "traditional-referral": {
      name: "Traditional Referral",
      weight: 100, // Only option for control
      openRate: 0.28, // Lower - no compelling context
      conversionRate: 0.25, // Lower - generic "join me" invite
      conversionVariance: 0.18,
      avgInvitesPerActivation: 2.5, // Fewer invites per activation (less motivated)
    },
  },
};

export const TREATMENT_CONFIG: BehaviorConfig = {
  signupToFvmRate: 0.95, // 95% reach FVM (+12% lift)
  fvmToInviteRate: 0.85, // 85% chance per session (+9% lift)
  inviteOpenRate: 0.50, // 50% open rate (good share cards) - baseline, overridden by loop
  inviteToSignupRate: 0.40, // 40% conversion (deep links work) - baseline, overridden by loop
  d1RetentionRate: 0.50, // +25% lift from control
  d7RetentionRate: 0.32, // +28% lift from control
  d28RetentionRate: 0.20, // +33% lift from control
  avgSessionDuration: 2400, // 40 minutes (longer engagement)
  avgTimeBetweenSessions: 86400 * 1.5, // 1.5 days (more frequent)
  avgTimeToInvite: 1800, // 30 minutes (faster to invite)
  avgInvitesPerUser: 10.0, // Halved from 20.0 to reduce K-factor
  viralBoost: 2.0, // Stronger viral boost
  
  // Loop-specific configs (Treatment group - 4 viral loop features with distinct performance)
  viralLoops: {
    "buddy-challenge": {
      name: "Buddy Challenge",
      weight: 35, // Popular - competitive angle
      openRate: 0.52, // Mid-tier - depends on relationship
      conversionRate: 0.38, // Mid-tier - not for everyone
      conversionVariance: 0.15,
      avgInvitesPerActivation: 1.4, // Halved from 2.8
    },
    "streak-rescue": {
      name: "Streak Rescue",
      weight: 30, // High weight - urgency drives action
      openRate: 0.68, // HIGH - urgency + FOMO
      conversionRate: 0.48, // High - clear value prop
      conversionVariance: 0.12, // Consistent urgency
      avgInvitesPerActivation: 1.1, // Halved from 2.2
    },
    "study-buddy": {
      name: "Study Buddy",
      weight: 25, // Very popular - mutual benefit
      openRate: 0.72, // HIGHEST - reciprocal value
      conversionRate: 0.55, // HIGHEST - win-win proposition
      conversionVariance: 0.08, // Very consistent
      avgInvitesPerActivation: 1.25, // Halved from 2.5
    },
    "tutor-spotlight": {
      name: "Tutor Spotlight",
      weight: 10, // Lower weight - more niche
      openRate: 0.45, // Lower - trust-dependent
      conversionRate: 0.42, // Mid-tier - quality over quantity
      conversionVariance: 0.10,
      avgInvitesPerActivation: 0.9, // Halved from 1.8
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
        
        // Generate personalized copy for challenge invite
        const inviteCopy = this.generateInviteCopy(selectedLoop, user.persona, user);
        
        this.addAction(journey, "challenge_created", this.addSeconds(resultsViewTime, 15), {
          challengeType: selectedLoop,
          subject: user.subject,
          resultId: `result_${user.userId}_${Date.now()}`,
          recipientEmail: "friend@example.com",
          // Store loop metrics
          loopOpenRate: loopMetrics.openRate,
          loopConversionRate: loopMetrics.conversionRate,
          // Add personalized copy from copy-kit
          copy: inviteCopy,
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
        
        // Generate personalized copy for this invite burst
        const inviteCopy = this.generateInviteCopy(selectedLoop, user.persona, user);
        
        for (let inviteIdx = 0; inviteIdx < numInvites; inviteIdx++) {
          this.addAction(journey, "invite_sent", this.addMinutes(inviteTime, inviteIdx * 2), {
            loop: selectedLoop,
            channel: this.selectChannel(),
            loopOpenRate: loopMetrics.openRate,
            loopConversionRate: loopMetrics.conversionRate,
            // Add personalized copy from copy-kit
            copy: inviteCopy,
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
   * Generate personalized copy for an invite using copy-kit
   */
  private generateInviteCopy(loop: string, persona: string, user: SyntheticUser): any {
    try {
      // Normalize loop name for copy-kit (buddy_challenge -> buddy-challenge)
      const normalizedLoop = loop.replace(/_/g, "-") as ViralLoop;
      
      // Build context data
      const contextData: any = {
        subject: user.subject || "this subject",
        score: Math.floor(Math.random() * 3) + 8, // Random score 8-10
        studentName: user.name,
        milestone: "Level " + Math.floor(Math.random() * 5 + 1),
        wins: ["improved scores", "5 lessons completed"],
        studentCount: Math.floor(Math.random() * 20 + 5),
      };

      // Get personalized copy from copy-kit
      const copy = copyKit.getPersonalizedCopy(
        {
          loop: normalizedLoop,
          persona: persona as Persona,
          tone: copyKit.determineTone(persona as Persona, contextData),
        },
        contextData
      );

      return {
        headline: copy.headline,
        body: copy.body,
        cta: copy.cta,
        tone: copy.metadata.tone,
        version: copy.metadata.version,
      };
    } catch (error) {
      // Fallback if copy-kit fails
      return {
        headline: "Join me on Varsity Tutors!",
        body: "Let's learn together",
        cta: "Get Started",
        tone: "friendly",
        version: "fallback",
      };
    }
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

