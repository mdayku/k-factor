/**
 * Database Seed Script
 * Populates database with simulation data for demo/development
 */

import { PrismaClient } from '@prisma/client';
import { CohortSimulator } from '../packages/simulation/src/cohort-simulator.js';

const prisma = new PrismaClient();

/**
 * Generate agent decision for an event
 */
function generateAgentDecision(event: any): any | null {
  const agentMap: Record<string, { agent: string; makeDecision: (e: any) => any }> = {
    'invite.sent': {
      agent: 'personalization',
      makeDecision: (e) => ({
        decision: {
          loop: e.metadata?.loop || 'traditional-referral',
          copyVariant: e.metadata?.copy?.version || 'A',
          channel: e.metadata?.channel || 'email',
          personalized: true,
        },
        rationale: `Selected ${e.metadata?.loop || 'traditional'} loop with ${e.metadata?.copy?.tone || 'friendly'} tone based on user persona and context`,
        featuresUsed: {
          userPersona: e.metadata?.persona || 'student',
          historicalEngagement: Math.random() > 0.5,
          viralLoop: e.metadata?.loop || 'traditional-referral',
        },
        latencyMs: Math.floor(Math.random() * 50) + 10, // 10-60ms
      })
    },
    'account.created': {
      agent: 'experimentation',
      makeDecision: (e) => ({
        decision: {
          cohort: e.metadata?.cohort || (Math.random() > 0.5 ? 'treatment' : 'control'),
          experimentId: 'viral-loops-v1',
          assignedFeatures: e.metadata?.cohort === 'treatment' 
            ? ['buddy-challenge', 'streak-rescue', 'study-buddy', 'tutor-spotlight']
            : [],
        },
        rationale: `Assigned user to ${e.metadata?.cohort || 'control'} cohort for viral loops A/B test`,
        featuresUsed: {
          randomSeed: Math.floor(Math.random() * 1000000),
          userProperties: { isReferred: e.metadata?.referral || false },
        },
        latencyMs: Math.floor(Math.random() * 30) + 5,
      })
    },
    'session.start': {
      agent: 'social-presence',
      makeDecision: (e) => ({
        decision: {
          showPresence: Math.random() > 0.3,
          cohortRoom: e.metadata?.subject ? `cohort_${e.metadata.subject.toLowerCase()}_${Math.floor(Math.random() * 5) + 1}` : null,
          activeUsers: Math.floor(Math.random() * 20) + 3,
        },
        rationale: 'Determined optimal presence signals to show based on subject and time of day',
        featuresUsed: {
          subject: e.metadata?.subject || 'general',
          timeOfDay: new Date(e.ts).getHours(),
        },
        latencyMs: Math.floor(Math.random() * 40) + 15,
      })
    },
    'practice.complete': {
      agent: 'incentives',
      makeDecision: (e) => ({
        decision: {
          showViralCTA: Math.random() > 0.4,
          viralLoop: ['buddy-challenge', 'streak-rescue', 'study-buddy'][Math.floor(Math.random() * 3)],
          incentiveType: Math.random() > 0.6 ? 'badge' : 'progress',
        },
        rationale: `User completed practice with score ${e.metadata?.score || 'unknown'}, showing viral CTA with contextual incentive`,
        featuresUsed: {
          score: e.metadata?.score || 0,
          consecutiveSessions: Math.floor(Math.random() * 5) + 1,
          viralPropensity: Math.random(),
        },
        latencyMs: Math.floor(Math.random() * 60) + 20,
      })
    },
    'challenge.created': {
      agent: 'tutor-advocacy',
      makeDecision: (e) => ({
        decision: {
          tutorMatch: Math.random() > 0.7,
          tutorId: Math.random() > 0.7 ? `tutor_${Math.floor(Math.random() * 100)}` : null,
          recommendTutor: Math.random() > 0.5,
        },
        rationale: 'Challenge context suggests tutor pairing could improve outcomes',
        featuresUsed: {
          challengeType: e.metadata?.challengeType || 'buddy-challenge',
          subject: e.metadata?.subject || 'general',
          difficulty: Math.random() > 0.5 ? 'hard' : 'medium',
        },
        latencyMs: Math.floor(Math.random() * 80) + 30,
      })
    },
  };

  const handler = agentMap[event.type];
  if (!handler) return null;

  const baseDecision = handler.makeDecision(event);
  
  return {
    agent: handler.agent,
    decision: baseDecision.decision,
    rationale: baseDecision.rationale,
    featuresUsed: baseDecision.featuresUsed,
    userId: event.userId || null,
    sessionId: event.sessionId || null,
    loop: event.metadata?.loop || null,
    latencyMs: baseDecision.latencyMs,
    createdAt: new Date(event.ts),
  };
}

async function main() {
  console.log('🌱 Starting database seed...\n');
  
  // Generate unique simulation ID for this run
  const simulationId = `sim-${Date.now()}`;
  console.log(`🆔 Simulation ID: ${simulationId}\n`);

  // Clear ONLY simulated data (keeps real users safe!)
  console.log('🧹 Cleaning previous simulation data...');
  const deletedEvents = await prisma.event.deleteMany({
    where: { isSimulated: true }
  });
  const deletedUsers = await prisma.user.deleteMany({
    where: { isSimulated: true }
  });
  console.log(`✅ Cleared ${deletedUsers.count} simulated users and ${deletedEvents.count} simulated events\n`);

  // Run simulation (in-memory only)
  console.log('🧪 Generating simulation data (Monte Carlo simulation - single run)...');
  console.log('   Creating 500 control + 500 treatment users with 14 days of activity');
  console.log('   Users have normally-distributed behavioral propensities for realistic variance\n');
  const simulator = new CohortSimulator();
  const experiment = simulator.runExperiment(500, 500, 14);
  
  console.log(`✅ Simulation data generated! (Single Monte Carlo run)`);
  console.log(`   Control K-factor: ${experiment.control.kFactor.toFixed(3)}`);
  console.log(`   Treatment K-factor: ${experiment.treatment.kFactor.toFixed(3)}`);
  console.log(`   📝 Note: In production, run 30-100 iterations and report mean ± SD with 95% CI`);

  // Get all events from simulation
  const simulationEvents = simulator.getEvents();
  console.log(`   Generated ${simulationEvents.length} events in-memory\n`);

  console.log('═'.repeat(60));
  console.log('💾 PERSISTING TO DATABASE (correct order: users first, then events)');
  console.log('═'.repeat(60) + '\n');

  // Create users (extract unique users from events)
  console.log('👥 Seeding users to database...');
  const userIds = new Set<string>();
  simulationEvents.forEach(event => {
    if (event.userId) userIds.add(event.userId);
  });

  const users = Array.from(userIds).map((userId, index) => ({
    id: userId,
    email: `sim-${simulationId}-${userId}@example.com`,
    role: index % 3 === 0 ? 'STUDENT' : index % 3 === 1 ? 'PARENT' : 'TUTOR',
    age: 15 + Math.floor(Math.random() * 30),
    isMinor: false,
    parentalConsent: true,
    coppaCompliant: true,
    isSimulated: true,
    simulationId: simulationId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Batch insert users (MUCH faster than individual creates)
  console.log(`   Inserting ${users.length} users in batch...`);
  await prisma.user.createMany({ data: users });
  console.log(`✅ Created ${users.length} users\n`);

  // Seed events (batch insert for speed)
  console.log('📝 Seeding events to database (referencing users created above)...');
  console.log(`   Inserting ${simulationEvents.length} events in batch...`);
  
  const eventData = simulationEvents.map(event => ({
    type: event.type,
    userId: event.userId || null,
    sessionId: event.sessionId,
    surface: event.surface,
    metadata: event.metadata || {},
    createdAt: new Date(event.ts),
    isSimulated: true,
    simulationId: simulationId,
  }));
  
  await prisma.event.createMany({ data: eventData });
  console.log(`✅ Created ${simulationEvents.length} events\n`);

  // Generate agent decisions for first 10k events
  console.log('🤖 Generating agent decisions (first 10,000 events)...');
  const agentDecisions: any[] = [];
  const eventsToProcess = Math.min(simulationEvents.length, 10000);
  
  for (let i = 0; i < eventsToProcess; i++) {
    const event = simulationEvents[i];
    
    // Generate agent decision based on event type
    const decision = generateAgentDecision(event);
    if (decision) {
      agentDecisions.push(decision);
    }
  }
  
  if (agentDecisions.length > 0) {
    console.log(`   Inserting ${agentDecisions.length} agent decisions in batch...`);
    await prisma.agentDecision.createMany({ data: agentDecisions });
    console.log(`✅ Created ${agentDecisions.length} agent decisions\n`);
  }

  // Summary
  console.log('═'.repeat(60));
  console.log('🎉 Database seed complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Simulation ID: ${simulationId}`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Events: ${simulationEvents.length}`);
  console.log(`   Agent Decisions: ${agentDecisions.length}`);
  console.log(`   Control K-factor: ${experiment.control.kFactor.toFixed(3)}`);
  console.log(`   Treatment K-factor: ${experiment.treatment.kFactor.toFixed(3)}`);
  console.log(`   K-factor lift: +${experiment.kFactorLift.toFixed(1)}%`);
  console.log('\n💡 Filter queries:');
  console.log(`   - This run only:  WHERE "simulationId" = '${simulationId}'`);
  console.log(`   - All simulations: WHERE "isSimulated" = true`);
  console.log(`   - Real users only: WHERE "isSimulated" = false`);
  console.log('\n✨ Your database is ready for Phase 4 (UI Dashboard)!');
  console.log('═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

