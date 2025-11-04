#!/usr/bin/env node

/**
 * Simulation Runner
 * CLI tool to run full 14-day cohort simulation and output metrics report
 */

import { CohortSimulator } from "./cohort-simulator.js";

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

function printSeparator() {
  console.log("═".repeat(80));
}

function printHeader(title: string) {
  printSeparator();
  console.log(`  ${title}`);
  printSeparator();
}

function printMetric(label: string, value: string, indent: number = 2) {
  const spaces = " ".repeat(indent);
  console.log(`${spaces}${label.padEnd(35)}${value}`);
}

function printCohortResults(results: any, isControl: boolean) {
  const label = isControl ? "CONTROL" : "TREATMENT";
  const targetK = isControl ? "0.8" : "≥1.20";
  
  console.log(`\n${label} COHORT (Target K: ${targetK})`);
  console.log("─".repeat(80));
  
  console.log("\n  📊 Funnel Metrics:");
  printMetric("Total Users", results.totalUsers.toString());
  printMetric("Reached FVM", `${results.fvmReached} (${formatPercent(results.fvmRate)})`);
  
  console.log("\n  🔁 Viral Metrics:");
  printMetric("Invites Sent", results.totalInvitesSent.toString());
  printMetric("Invites Per User", formatNumber(results.invitesPerUser));
  printMetric("Invites Accepted", results.totalInvitesAccepted.toString());
  printMetric("Invite Conversion Rate", formatPercent(results.inviteConversionRate));
  printMetric("**K-FACTOR**", `**${formatNumber(results.kFactor, 3)}**`);
  
  console.log("\n  📈 Retention:");
  printMetric("D1 Retention", formatPercent(results.d1Retention));
  printMetric("D7 Retention", formatPercent(results.d7Retention));
  printMetric("D28 Retention", formatPercent(results.d28Retention));
  
  console.log("\n  💰 Economics:");
  printMetric("Avg LTV", `$${formatNumber(results.avgLTV)}`);
  printMetric("Avg CAC", `$${formatNumber(results.avgCAC)}`);
  printMetric("LTV:CAC Ratio", formatNumber(results.ltvCacRatio, 2));
  
  console.log("\n  👥 Referral Mix:");
  printMetric("Organic Signups", results.organicSignups.toString());
  printMetric("Referred Signups", results.referredSignups.toString());
  printMetric("Referral Mix %", formatPercent(results.referralMixPercent / 100));
}

function printComparison(experiment: any) {
  console.log("\n");
  printHeader("📊 EXPERIMENT RESULTS COMPARISON");
  
  console.log("\n  🎯 Primary Success Metrics:\n");
  
  // K-Factor
  const kFactorMet = experiment.treatment.kFactor >= 1.20;
  const kFactorIcon = kFactorMet ? "✅" : "❌";
  printMetric(
    `${kFactorIcon} K-Factor Lift`,
    `+${formatNumber(experiment.kFactorLift, 1)}% (${formatNumber(experiment.control.kFactor, 3)} → ${formatNumber(experiment.treatment.kFactor, 3)})`
  );
  
  // FVM Lift
  const fvmLiftMet = experiment.fvmLift >= 20;
  const fvmIcon = fvmLiftMet ? "✅" : "❌";
  printMetric(
    `${fvmIcon} FVM Lift`,
    `+${formatNumber(experiment.fvmLift, 1)}% (${formatPercent(experiment.control.fvmRate)} → ${formatPercent(experiment.treatment.fvmRate)})`
  );
  
  // D7 Retention Lift
  const d7LiftMet = experiment.d7RetentionLift >= 10;
  const d7Icon = d7LiftMet ? "✅" : "❌";
  printMetric(
    `${d7Icon} D7 Retention Lift`,
    `+${formatNumber(experiment.d7RetentionLift, 1)}% (${formatPercent(experiment.control.d7Retention)} → ${formatPercent(experiment.treatment.d7Retention)})`
  );
  
  // Referral Mix
  const refMixMet = experiment.treatment.referralMixPercent >= 30;
  const refMixIcon = refMixMet ? "✅" : "❌";
  printMetric(
    `${refMixIcon} Referral Mix`,
    `${formatPercent(experiment.treatment.referralMixPercent / 100)} of signups (target: ≥30%)`
  );
  
  console.log("\n  📈 Statistical Significance:\n");
  const sigIcon = experiment.isSignificant ? "✅" : "⚠️";
  printMetric(
    `${sigIcon} Significance`,
    experiment.isSignificant 
      ? `SIGNIFICANT (p < 0.05, ${formatPercent(experiment.confidenceLevel)} confidence)` 
      : `Not significant (needs larger sample or longer duration)`
  );
  
  console.log("\n");
  printSeparator();
  
  // Final verdict
  const allTargetsMet = kFactorMet && fvmLiftMet && d7LiftMet && refMixMet;
  
  if (allTargetsMet && experiment.isSignificant) {
    console.log("\n  🎉 SUCCESS! All targets met with statistical significance.");
    console.log(`  📊 Treatment K-Factor: ${formatNumber(experiment.treatment.kFactor, 3)} (target: ≥1.20)`);
    console.log(`  🚀 This represents a ${formatNumber(experiment.kFactorLift, 1)}% improvement in viral growth!`);
  } else if (allTargetsMet) {
    console.log("\n  ✅ All targets met! Consider longer duration for statistical confidence.");
  } else {
    console.log("\n  ⚠️  Some targets not met. Review viral mechanics and conversion rates.");
  }
  
  console.log("\n");
}

function printEventSummary(simulator: CohortSimulator) {
  const events = simulator.getEvents();
  if (events.length === 0) return;
  
  console.log("\n");
  printHeader("📝 EVENT STREAM SUMMARY");
  
  // Count event types
  const eventCounts: Record<string, number> = {};
  for (const event of events) {
    eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
  }
  
  console.log(`\n  Total Events Generated: ${events.length}\n`);
  console.log("  Top Event Types:");
  
  // Sort by count and show top 10
  const sorted = Object.entries(eventCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  for (const [type, count] of sorted) {
    printMetric(type, count.toString());
  }
  
  console.log("\n");
}

async function main() {
  printHeader("🎭 10x K-FACTOR SIMULATION");
  
  console.log("\n  This simulation demonstrates viral growth metrics using synthetic data.");
  console.log("  Running 14-day A/B experiment with Control (K=0.8) vs Treatment (K≥1.20).\n");
  
  // Configuration
  const controlSize = 600; // Increased from 500 for better funnel coverage
  const treatmentSize = 600; // Increased from 500 for better funnel coverage
  const durationDays = 14;
  
  console.log(`  Cohort Sizes: ${controlSize + treatmentSize} total users`);
  console.log(`  Duration: ${durationDays} days`);
  console.log(`  Start Date: ${new Date().toISOString().split('T')[0]}\n`);
  
  printSeparator();
  
  // Run simulation
  const simulator = new CohortSimulator();
  const experiment = simulator.runExperiment(
    controlSize,
    treatmentSize,
    durationDays
  );
  
  // Print results
  printCohortResults(experiment.control, true);
  printCohortResults(experiment.treatment, false);
  printComparison(experiment);
  printEventSummary(simulator);
  
  printSeparator();
  console.log("\n  💾 Event stream and metrics available for analytics dashboard.");
  console.log("  📊 Use generated events to power K-factor tracking and viral funnels.\n");
}

// Run if called directly
main().catch(console.error);

export { main };

