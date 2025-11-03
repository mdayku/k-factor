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
  | "streak_rescued";

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

export interface BehaviorConfig {
  // Funnel conversion rates
  signupToFvmRate: number; // % who reach FVM
  fvmToInviteRate: number; // % who send invites after FVM
  inviteOpenRate: number; // % of invites that are opened
  inviteToSignupRate: number; // % of opened invites that convert
  
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
}

export const CONTROL_CONFIG: BehaviorConfig = {
  signupToFvmRate: 0.60, // 60% reach FVM
  fvmToInviteRate: 0.15, // 15% send invites
  inviteOpenRate: 0.30, // 30% open rate
  inviteToSignupRate: 0.25, // 25% convert
  d1RetentionRate: 0.40,
  d7RetentionRate: 0.25,
  d28RetentionRate: 0.15,
  avgSessionDuration: 1800, // 30 minutes
  avgTimeBetweenSessions: 86400 * 2, // 2 days
  avgTimeToInvite: 3600, // 1 hour after FVM
  avgInvitesPerUser: 1.5,
  viralBoost: 1.0 // No boost for control
};

export const TREATMENT_CONFIG: BehaviorConfig = {
  signupToFvmRate: 0.72, // +20% lift
  fvmToInviteRate: 0.85, // High invitation rate after FVM
  inviteOpenRate: 0.50, // 50% open rate (good share cards)
  inviteToSignupRate: 0.40, // 40% conversion (deep links work)
  d1RetentionRate: 0.50, // +25% lift
  d7RetentionRate: 0.32, // +28% lift
  d28RetentionRate: 0.20, // +33% lift
  avgSessionDuration: 2400, // 40 minutes (longer engagement)
  avgTimeBetweenSessions: 86400 * 1.5, // 1.5 days (more frequent)
  avgTimeToInvite: 1800, // 30 minutes (faster to invite)
  avgInvitesPerUser: 3.5, // More invites per user
  viralBoost: 1.8 // Stronger viral boost
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

    // FVM attempt
    if (this.shouldOccur(this.config.signupToFvmRate * user.conversionProbability)) {
      journey.fvmReached = true;
      const fvmTime = this.addMinutes(firstSessionTime, 10 + Math.random() * 20);
      this.addAction(journey, "fvm_reached", fvmTime, {
        context: "micro_deck",
        completedQuestions: 5
      });

      // Post-FVM invite behavior
      if (this.shouldOccur(this.config.fvmToInviteRate * user.shareability * this.config.viralBoost)) {
        const inviteTime = this.addSeconds(fvmTime, this.config.avgTimeToInvite + this.randomVariance(this.config.avgTimeToInvite, 0.5));
        const numInvites = Math.ceil(this.config.avgInvitesPerUser * user.shareability * this.config.viralBoost);
        
        for (let i = 0; i < numInvites; i++) {
          this.addAction(journey, "invite_sent", this.addMinutes(inviteTime, i * 2), {
            loop: this.selectViralLoop(user.persona),
            channel: this.selectChannel()
          });
          journey.invitesSent++;
        }
      }
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
    if (this.shouldOccur(0.3)) {
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

      // Challenge created (20% of engaged users after results)
      if (this.shouldOccur(0.2 * user.shareability * this.config.viralBoost)) {
        this.addAction(journey, "challenge_created", this.addSeconds(resultsViewTime, 15), {
          challengeType: Math.random() < 0.5 ? "buddy-challenge" : "study-buddy",
          subject: user.subject,
          resultId: `result_${user.userId}_${Date.now()}`,
          recipientEmail: "friend@example.com"
        });
        journey.invitesSent++; // Count as an invite
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
   * Select a viral loop based on persona
   */
  private selectViralLoop(persona: string): string {
    if (persona === "student") {
      const loops = ["buddy_challenge", "streak_rescue", "results_rally", "achievement_spotlight"];
      return loops[Math.floor(Math.random() * loops.length)];
    } else if (persona === "parent") {
      return Math.random() < 0.7 ? "proud_parent" : "achievement_spotlight";
    } else {
      return Math.random() < 0.7 ? "tutor_spotlight" : "class_watch_party";
    }
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

