/**
 * Event Stream Generator
 * Converts user journeys into event streams matching the event schema
 */

import type { SyntheticUser } from "./user-generator.js";
import type { UserJourney, TimedAction } from "./behavior-engine.js";

// Import event types from event-schema
// We'll define a subset here for the simulation
export interface SimulationEvent {
  type: string;
  ts: string; // ISO timestamp
  userId: string | null;
  sessionId: string;
  surface: "web" | "mobile" | "email";
  metadata?: Record<string, any>;
}

export class EventGenerator {
  private eventLog: SimulationEvent[] = [];
  private sessionCounter = 0;

  /**
   * Generate all events for a user journey
   */
  generateEvents(user: SyntheticUser, journey: UserJourney): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    let currentSessionId: string | null = null;

    for (const timedAction of journey.actions) {
      const eventBatch = this.actionToEvents(user, timedAction, currentSessionId);
      events.push(...eventBatch);

      // Track session changes
      if (timedAction.action === "session_start") {
        currentSessionId = `session_${user.userId}_${++this.sessionCounter}`;
      } else if (timedAction.action === "session_end") {
        currentSessionId = null;
      }
    }

    this.eventLog.push(...events);
    return events;
  }

  /**
   * Convert a single user action into one or more events
   */
  private actionToEvents(
    user: SyntheticUser,
    action: TimedAction,
    sessionId: string | null
  ): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const ts = action.timestamp.toISOString();
    const sid = sessionId || `session_${user.userId}_${++this.sessionCounter}`;
    const surface = this.selectSurface(user);

    switch (action.action) {
      case "signup":
        events.push({
          type: "account.created",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            persona: user.persona,
            referrerSignedLinkId: action.metadata?.referrerSignedLinkId || null,
            referrerId: action.metadata?.referrerId || null,
            age: user.age,
            parentalConsentGiven: user.parentalConsentGiven,
            coppaMinor: user.coppaMinor,
            cohort: user.cohortId || "unknown"
          }
        });
        break;

      case "session_start":
        events.push({
          type: "session.started",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            persona: user.persona,
            subject: action.metadata?.subject,
            productType: this.selectProductType(user.persona)
          }
        });
        break;

      case "session_end":
        events.push({
          type: "session.completed",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            durationSeconds: action.metadata?.duration,
            rating: Math.random() < 0.8 ? 5 : 4 // High ratings
          }
        });
        break;

      case "practice_start":
        events.push({
          type: "practice.started",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            subject: action.metadata?.subject,
            difficulty: action.metadata?.difficulty
          }
        });
        break;

      case "practice_complete":
        events.push({
          type: "practice.completed",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            score: action.metadata?.score,
            questionsCompleted: action.metadata?.questionsCompleted
          }
        });
        break;

      case "results_view":
        events.push({
          type: "results.viewed",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            resultType: "practice",
            score: action.metadata?.score,
            showedShareCTA: action.metadata?.showedShareCTA
          }
        });
        break;

      case "invite_sent":
        events.push({
          type: "invite.sent",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            loop: action.metadata?.loop,
            channel: action.metadata?.channel,
            signedLinkId: `link_${user.userId}_${Date.now()}`,
            cohort: user.cohortId || "unknown"
          }
        });
        break;

      case "invite_opened":
        events.push({
          type: "invite.opened",
          ts,
          userId: null, // Not yet a user
          sessionId: `new_${Date.now()}`,
          surface,
          metadata: {
            signedLinkId: action.metadata?.signedLinkId,
            referrerId: action.metadata?.referrerId
          }
        });
        break;

      case "fvm_reached":
        events.push({
          type: "fvm.reached",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            context: action.metadata?.context,
            timeToFvm: action.metadata?.timeToFvm
          }
        });
        break;

      case "badge_earned":
        events.push({
          type: "badge.earned",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            badgeType: action.metadata?.badgeType,
            streakDays: action.metadata?.streakDays
          }
        });
        break;

      case "streak_risk":
        events.push({
          type: "streak.risk",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            currentStreak: action.metadata?.currentStreak,
            hoursUntilLoss: action.metadata?.hoursUntilLoss
          }
        });
        break;

      case "streak_rescued":
        events.push({
          type: "streak.rescued",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            rescuedBy: action.metadata?.rescuedBy,
            newStreak: action.metadata?.newStreak
          }
        });
        break;

      // New Phase 4 events
      case "challenge_created":
        events.push({
          type: "challenge.created",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            challengeType: action.metadata?.challengeType || "buddy-challenge",
            subject: action.metadata?.subject,
            resultId: action.metadata?.resultId,
            recipientEmail: action.metadata?.recipientEmail
          }
        });
        break;

      case "challenge_completed":
        events.push({
          type: "challenge.completed",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            challengeId: action.metadata?.challengeId,
            score: action.metadata?.score,
            beatReferrer: action.metadata?.beatReferrer
          }
        });
        break;

      case "share_clicked":
        events.push({
          type: "share.clicked",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            shareType: action.metadata?.shareType || "results",
            variant: action.metadata?.variant, // student/parent/tutor
            channel: action.metadata?.channel, // twitter/whatsapp/email
            resultId: action.metadata?.resultId
          }
        });
        break;

      case "share_viewed":
        events.push({
          type: "share.viewed",
          ts,
          userId: null, // Not yet a user
          sessionId: `new_${Date.now()}`,
          surface,
          metadata: {
            shareId: action.metadata?.shareId,
            referrerId: action.metadata?.referrerId
          }
        });
        break;

      case "presence_joined":
        events.push({
          type: "presence.joined",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            subject: action.metadata?.subject
          }
        });
        break;

      case "presence_left":
        events.push({
          type: "presence.left",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            subject: action.metadata?.subject,
            durationSeconds: action.metadata?.durationSeconds
          }
        });
        break;

      case "cohort_joined":
        events.push({
          type: "cohort.joined",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            cohortRoomId: action.metadata?.cohortRoomId,
            roomName: action.metadata?.roomName,
            subject: action.metadata?.subject
          }
        });
        break;

      case "cohort_activity":
        events.push({
          type: "cohort.activity",
          ts,
          userId: user.userId,
          sessionId: sid,
          surface,
          metadata: {
            cohortRoomId: action.metadata?.cohortRoomId,
            activityType: action.metadata?.activityType, // practice/challenge/milestone
            description: action.metadata?.description
          }
        });
        break;
    }

    return events;
  }

  /**
   * Select surface based on user preferences
   */
  private selectSurface(user: SyntheticUser): "web" | "mobile" | "email" {
    // Students prefer mobile, parents prefer web
    if (user.persona === "student") {
      return Math.random() < 0.7 ? "mobile" : "web";
    } else if (user.persona === "parent") {
      return Math.random() < 0.6 ? "web" : "mobile";
    } else {
      return Math.random() < 0.5 ? "web" : "mobile";
    }
  }

  /**
   * Select product type based on persona
   */
  private selectProductType(persona: string): string {
    if (persona === "student") {
      const types = ["instant_tutor", "ai_tutor", "practice", "flashcards"];
      return types[Math.floor(Math.random() * types.length)];
    } else if (persona === "parent") {
      return Math.random() < 0.7 ? "scheduled_tutor" : "live_class";
    } else {
      return Math.random() < 0.6 ? "scheduled_tutor" : "instant_tutor";
    }
  }

  /**
   * Get all events sorted by timestamp
   */
  getAllEvents(): SimulationEvent[] {
    return this.eventLog.sort((a, b) => 
      new Date(a.ts).getTime() - new Date(b.ts).getTime()
    );
  }

  /**
   * Get events for a specific time range
   */
  getEventsInRange(startDate: Date, endDate: Date): SimulationEvent[] {
    return this.eventLog.filter(e => {
      const eventTime = new Date(e.ts);
      return eventTime >= startDate && eventTime <= endDate;
    });
  }

  /**
   * Get event statistics
   */
  getStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsPerDay: number[];
    uniqueUsers: number;
    uniqueSessions: number;
  } {
    const eventsByType: Record<string, number> = {};
    const userSet = new Set<string>();
    const sessionSet = new Set<string>();
    const eventsByDay: Map<string, number> = new Map();

    for (const event of this.eventLog) {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

      // Track unique users and sessions
      if (event.userId) userSet.add(event.userId);
      sessionSet.add(event.sessionId);

      // Count by day
      const day = event.ts.split('T')[0];
      eventsByDay.set(day, (eventsByDay.get(day) || 0) + 1);
    }

    return {
      totalEvents: this.eventLog.length,
      eventsByType,
      eventsPerDay: Array.from(eventsByDay.values()),
      uniqueUsers: userSet.size,
      uniqueSessions: sessionSet.size
    };
  }

  /**
   * Add a raw event directly (for viral spread events like invite.opened)
   */
  addRawEvent(event: SimulationEvent): void {
    this.eventLog.push(event);
  }

  /**
   * Clear event log
   */
  clear(): void {
    this.eventLog = [];
    this.sessionCounter = 0;
  }
}

