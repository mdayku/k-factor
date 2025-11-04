/**
 * Synthetic User Generator
 * Creates realistic user profiles for simulation
 */

export type Persona = "student" | "parent" | "tutor";

export interface SyntheticUser {
  userId: string;
  persona: Persona;
  email: string;
  name: string;
  age: number;
  subject?: string; // For students and tutors
  grade?: number; // For students
  location: string;
  deviceId: string;
  ipAddress: string;
  
  // Behavioral attributes
  engagementLevel: "low" | "medium" | "high";
  conversionProbability: number; // 0-1
  shareability: number; // 0-1, how likely to share/invite
  
  // Compliance flags
  coppaMinor: boolean; // Under 13
  parentalConsentGiven: boolean;
  
  // Fraud signals
  isFraudulent: boolean;
  fraudType?: "duplicate_device" | "duplicate_email" | "fake_referrals" | "bot_behavior";
  
  // Network
  friendIds: string[];
  cohortId?: string;
  
  // Economics
  ltv: number;
  cac: number;
  
  createdAt: Date;
}

const FIRST_NAMES = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Skylar", "Dakota",
  "Emma", "Liam", "Olivia", "Noah", "Ava", "Elijah", "Sophia", "Lucas", "Isabella", "Mason",
  "Mia", "Logan", "Charlotte", "Ethan", "Amelia", "Oliver", "Harper", "Aiden", "Evelyn", "Jackson"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"
];

const SUBJECTS = [
  "Math", "Algebra", "Geometry", "Calculus", "Statistics",
  "English", "Literature", "Writing", "Reading",
  "Science", "Biology", "Chemistry", "Physics",
  "History", "Geography", "Social Studies",
  "Computer Science", "Programming", "Spanish", "French"
];

const LOCATIONS = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC"
];

export class UserGenerator {
  private userCount = 0;
  private fraudCount = 0;
  private coppaMinorCount = 0;

  /**
   * Box-Muller transform for normal distribution sampling
   */
  private normalRandom(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Clamp value between min and max
   */
  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Generate a batch of synthetic users
   */
  generate(count: number, options: {
    fraudRate?: number; // % of users that are fraudulent
    coppaMinorRate?: number; // % of users under 13
    parentalConsentRate?: number; // % of minors with consent
  } = {}): SyntheticUser[] {
    const {
      fraudRate = 0.01, // 1% fraud
      coppaMinorRate = 0.15, // 15% minors
      parentalConsentRate = 0.80 // 80% of minors have consent
    } = options;

    const users: SyntheticUser[] = [];

    for (let i = 0; i < count; i++) {
      users.push(this.generateOne(fraudRate, coppaMinorRate, parentalConsentRate));
    }

    return users;
  }

  private generateOne(
    fraudRate: number,
    coppaMinorRate: number,
    parentalConsentRate: number
  ): SyntheticUser {
    this.userCount++;
    const userId = `u${this.userCount.toString().padStart(6, '0')}`;
    
    // Determine persona (40% student, 30% parent, 30% tutor)
    const rand = Math.random();
    let persona: Persona;
    if (rand < 0.4) persona = "student";
    else if (rand < 0.7) persona = "parent";
    else persona = "tutor";

    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    
    // Age distribution by persona
    let age: number;
    if (persona === "student") {
      age = 8 + Math.floor(Math.random() * 11); // 8-18
    } else if (persona === "parent") {
      age = 30 + Math.floor(Math.random() * 21); // 30-50
    } else {
      age = 18 + Math.floor(Math.random() * 32); // 18-49
    }

    // COPPA compliance
    const coppaMinor = persona === "student" && age < 13 && Math.random() < coppaMinorRate;
    const parentalConsentGiven = coppaMinor ? Math.random() < parentalConsentRate : true;

    // Fraud detection
    const isFraudulent = Math.random() < fraudRate;
    let fraudType: SyntheticUser["fraudType"];
    if (isFraudulent) {
      this.fraudCount++;
      const fraudTypes: Array<"duplicate_device" | "duplicate_email" | "fake_referrals" | "bot_behavior"> = [
        "duplicate_device", "duplicate_email", "fake_referrals", "bot_behavior"
      ];
      fraudType = fraudTypes[Math.floor(Math.random() * fraudTypes.length)];
    }

    // Email
    const emailDomain = isFraudulent && fraudType === "duplicate_email" 
      ? "tempmail.com" 
      : Math.random() < 0.5 ? "gmail.com" : "yahoo.com";
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${this.userCount}@${emailDomain}`;

    // Device and IP
    const deviceId = isFraudulent && fraudType === "duplicate_device"
      ? `device-fraud-${Math.floor(this.fraudCount / 2)}` // Duplicate devices
      : `device-${userId}`;
    const ipAddress = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;

    // Behavioral attributes with normal distributions for realistic variance
    const engagementLevel = Math.random() < 0.2 ? "low" : Math.random() < 0.6 ? "medium" : "high";
    
    // Conversion probability: Normal distribution with mean based on engagement
    const conversionMean = engagementLevel === "high" ? 0.65 : engagementLevel === "medium" ? 0.45 : 0.25;
    const conversionProbability = this.clamp(this.normalRandom(conversionMean, 0.15), 0.05, 0.95);
    
    // Shareability: Normal distribution (mean ~0.5, SD=0.2)
    const shareabilityMean = engagementLevel === "high" ? 0.95 : engagementLevel === "medium" ? 0.80 : 0.65;
    const shareability = this.clamp(this.normalRandom(shareabilityMean, 0.12), 0.50, 1.0); // Higher floor + ceiling

    // Subject (for students and tutors)
    const subject = persona !== "parent" 
      ? SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)]
      : undefined;

    // Grade (for students)
    const grade = persona === "student" 
      ? Math.min(Math.max(age - 5, 1), 12)
      : undefined;

    // Location
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

    // Economics
    const ltv = Math.random() * 500 + 100; // $100-$600
    const cac = Math.random() * 100 + 20; // $20-$120

    return {
      userId,
      persona,
      email,
      name,
      age,
      subject,
      grade,
      location,
      deviceId,
      ipAddress,
      engagementLevel,
      conversionProbability,
      shareability,
      coppaMinor,
      parentalConsentGiven,
      isFraudulent,
      fraudType,
      friendIds: [],
      ltv,
      cac,
      createdAt: new Date()
    };
  }

  /**
   * Create friendship networks (used for viral simulation)
   */
  createFriendships(users: SyntheticUser[], avgFriendsPerUser: number = 5): void {
    for (const user of users) {
      const numFriends = Math.max(0, Math.floor(Math.random() * avgFriendsPerUser * 2));
      
      // Find potential friends (same persona, similar age)
      const potentialFriends = users.filter(u => 
        u.userId !== user.userId &&
        u.persona === user.persona &&
        Math.abs(u.age - user.age) <= 5 &&
        !user.friendIds.includes(u.userId)
      );

      // Randomly select friends
      for (let i = 0; i < Math.min(numFriends, potentialFriends.length); i++) {
        const randomIndex = Math.floor(Math.random() * potentialFriends.length);
        const friend = potentialFriends.splice(randomIndex, 1)[0];
        
        // Bidirectional friendship
        user.friendIds.push(friend.userId);
        friend.friendIds.push(user.userId);
      }
    }
  }

  /**
   * Assign users to cohorts for experimentation
   */
  assignCohorts(users: SyntheticUser[], cohorts: string[] = ["control", "treatment"]): void {
    for (const user of users) {
      user.cohortId = cohorts[Math.floor(Math.random() * cohorts.length)];
    }
  }

  /**
   * Get statistics about generated users
   */
  getStats(users: SyntheticUser[]): {
    total: number;
    byPersona: Record<Persona, number>;
    fraudCount: number;
    coppaMinorsWithoutConsent: number;
    avgConversionRate: number;
    avgShareability: number;
  } {
    const byPersona: Record<Persona, number> = { student: 0, parent: 0, tutor: 0 };
    let fraudCount = 0;
    let coppaMinorsWithoutConsent = 0;
    let totalConversion = 0;
    let totalShareability = 0;

    for (const user of users) {
      byPersona[user.persona]++;
      if (user.isFraudulent) fraudCount++;
      if (user.coppaMinor && !user.parentalConsentGiven) coppaMinorsWithoutConsent++;
      totalConversion += user.conversionProbability;
      totalShareability += user.shareability;
    }

    return {
      total: users.length,
      byPersona,
      fraudCount,
      coppaMinorsWithoutConsent,
      avgConversionRate: totalConversion / users.length,
      avgShareability: totalShareability / users.length
    };
  }
}

