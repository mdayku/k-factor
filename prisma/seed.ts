/**
 * Database Seed Script
 * Populates database with simulation data for demo/development
 */

import { PrismaClient } from '@prisma/client';
import { CohortSimulator } from '../packages/simulation/src/cohort-simulator.js';

const prisma = new PrismaClient();

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
  console.log('🧪 Generating simulation data (in-memory - not touching DB yet)...');
  console.log('   Creating 500 control + 500 treatment users with 14 days of activity\n');
  const simulator = new CohortSimulator();
  const experiment = simulator.runExperiment(500, 500, 14);
  
  console.log(`✅ Simulation data generated!`);
  console.log(`   Control K-factor: ${experiment.control.kFactor.toFixed(3)}`);
  console.log(`   Treatment K-factor: ${experiment.treatment.kFactor.toFixed(3)}`);

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

  // Summary
  console.log('═'.repeat(60));
  console.log('🎉 Database seed complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Simulation ID: ${simulationId}`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Events: ${simulationEvents.length}`);
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

