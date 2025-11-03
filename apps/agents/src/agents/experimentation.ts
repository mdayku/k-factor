/**
 * Experimentation Agent
 * Traffic allocation, exposure logging, K computation, guardrails
 */

import type { ExperimentationRequest, ExperimentationResponse } from "mcp-protocol";

// In-memory experiment assignments (should use Redis/DB in production)
const experimentAssignments = new Map<string, { cohort: string; assignedAt: number }>();

// Experiment configurations
const ACTIVE_EXPERIMENTS = {
  "k-factor-loops-v1": {
    cohorts: ["control", "variant_a", "variant_b"],
    weights: [0.33, 0.33, 0.34], // 33/33/34 split
  },
  "reward-types-v1": {
    cohorts: ["streaks", "gems", "classes"],
    weights: [0.33, 0.33, 0.34],
  },
};

// Metrics storage (in-memory, should use time-series DB in production)
interface MetricsData {
  invites: number;
  opens: number;
  joins: number;
  fvms: number;
  cohort?: string;
}

const metricsStore = new Map<string, MetricsData>();

export async function handleExperimentationRequest(
  request: ExperimentationRequest
): Promise<ExperimentationResponse> {
  const startTime = Date.now();
  const { userId, experimentName, action, contextData } = request.context as any;

  let decision: any = {};

  switch (action) {
    case "assign":
      decision = await assignExperiment(userId, experimentName, contextData);
      break;
    case "get_variant":
      decision = await getVariant(userId, experimentName, contextData);
      break;
    case "log_exposure":
      decision = await logExposure(userId, experimentName, contextData);
      break;
    case "compute_metrics":
      decision = await computeMetrics(experimentName, contextData);
      break;
  }

  const latencyMs = Date.now() - startTime;

  return {
    decision,
    rationale: generateRationale(action, userId, experimentName, decision),
    featuresUsed: ["userId", "experimentName", "cohort", "metrics"],
    confidence: 0.93,
    latencyMs,
    version: "v1.0",
    timestamp: new Date().toISOString(),
    requestId: request.requestId,
  };
}

async function assignExperiment(
  userId: string,
  experimentName: string,
  contextData: any
): Promise<any> {
  const key = `${experimentName}:${userId}`;

  // Check if already assigned
  if (experimentAssignments.has(key)) {
    const existing = experimentAssignments.get(key)!;
    return {
      cohort: existing.cohort,
      variant: undefined,
      experimentName,
    };
  }

  // Get experiment config
  const experiment = ACTIVE_EXPERIMENTS[experimentName as keyof typeof ACTIVE_EXPERIMENTS];
  if (!experiment) {
    // Default to control if experiment doesn't exist
    return {
      cohort: "control",
      variant: undefined,
      experimentName: experimentName || "default",
    };
  }

  // Deterministic assignment based on userId hash
  const cohort = deterministicAssignment(userId, experiment.cohorts, experiment.weights);

  // Store assignment
  experimentAssignments.set(key, {
    cohort,
    assignedAt: Date.now(),
  });

  return {
    cohort,
    variant: undefined,
    experimentName,
  };
}

async function getVariant(
  userId: string,
  experimentName: string,
  contextData: any
): Promise<any> {
  const key = `${experimentName}:${userId}`;
  const assignment = experimentAssignments.get(key);

  if (!assignment) {
    // Auto-assign if not assigned yet
    return await assignExperiment(userId, experimentName, contextData);
  }

  return {
    cohort: assignment.cohort,
    variant: undefined,
    experimentName,
  };
}

async function logExposure(
  userId: string,
  experimentName: string,
  contextData: any
): Promise<any> {
  // In production, this would log to analytics pipeline
  const key = `${experimentName}:${userId}`;
  const assignment = experimentAssignments.get(key);

  console.log(`[EXPOSURE] ${experimentName} - User: ${userId}, Cohort: ${assignment?.cohort || "unknown"}`);

  return {
    cohort: assignment?.cohort || "unknown",
    variant: undefined,
    experimentName,
  };
}

async function computeMetrics(
  experimentName: string,
  contextData: any
): Promise<any> {
  // Get metrics for all cohorts in the experiment
  const experiment = ACTIVE_EXPERIMENTS[experimentName as keyof typeof ACTIVE_EXPERIMENTS];
  
  if (!experiment) {
    // Return aggregate metrics if experiment doesn't exist
    return {
      cohort: "all",
      variant: undefined,
      experimentName,
      metrics: computeAggregateMetrics(),
    };
  }

  // Compute per-cohort metrics
  const cohortMetrics: Record<string, any> = {};
  
  for (const cohort of experiment.cohorts) {
    const cohortKey = `${experimentName}:${cohort}`;
    const cohortData = metricsStore.get(cohortKey) || { invites: 0, opens: 0, joins: 0, fvms: 0 };
    
    cohortMetrics[cohort] = {
      k: calculateK(cohortData),
      invitesPerUser: cohortData.invites / Math.max(cohortData.joins, 1),
      conversionRate: cohortData.joins / Math.max(cohortData.opens, 1),
      fvmLift: cohortData.fvms / Math.max(cohortData.joins, 1),
    };
  }

  // Return overall metrics with cohort breakdown
  return {
    cohort: contextData?.currentCohort || "all",
    variant: undefined,
    experimentName,
    metrics: {
      ...computeAggregateMetrics(),
      cohortBreakdown: cohortMetrics,
    },
  };
}

function deterministicAssignment(userId: string, cohorts: string[], weights: number[]): string {
  // Simple hash-based assignment
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const normalized = Math.abs(hash % 100) / 100; // 0 to 1

  // Cumulative weights
  let cumWeight = 0;
  for (let i = 0; i < cohorts.length; i++) {
    cumWeight += weights[i];
    if (normalized < cumWeight) {
      return cohorts[i];
    }
  }

  return cohorts[cohorts.length - 1];
}

function calculateK(metrics: MetricsData): number {
  const { invites, opens, joins } = metrics;
  
  if (joins === 0) return 0;
  
  const invitesPerUser = invites / joins;
  const conversionRate = joins / Math.max(opens, 1);
  
  return Number((invitesPerUser * conversionRate).toFixed(3));
}

function computeAggregateMetrics(): any {
  // Aggregate all metrics
  let totalInvites = 0;
  let totalOpens = 0;
  let totalJoins = 0;
  let totalFVMs = 0;

  for (const [key, data] of metricsStore.entries()) {
    totalInvites += data.invites;
    totalOpens += data.opens;
    totalJoins += data.joins;
    totalFVMs += data.fvms;
  }

  const k = calculateK({ invites: totalInvites, opens: totalOpens, joins: totalJoins, fvms: totalFVMs });
  const invitesPerUser = totalJoins > 0 ? totalInvites / totalJoins : 0;
  const conversionRate = totalOpens > 0 ? totalJoins / totalOpens : 0;
  const fvmLift = totalJoins > 0 ? totalFVMs / totalJoins : 0;

  return {
    k: Number(k.toFixed(3)),
    invitesPerUser: Number(invitesPerUser.toFixed(2)),
    conversionRate: Number(conversionRate.toFixed(3)),
    fvmLift: Number((fvmLift * 100).toFixed(1)), // as percentage
  };
}

function generateRationale(action: string, userId: string, experimentName: string, decision: any): string {
  switch (action) {
    case "assign":
      return `Assigned user ${userId} to cohort "${decision.cohort}" in experiment "${experimentName}"`;
    case "get_variant":
      return `Retrieved variant for user ${userId}: cohort "${decision.cohort}" in experiment "${experimentName}"`;
    case "log_exposure":
      return `Logged exposure for user ${userId} in experiment "${experimentName}", cohort "${decision.cohort}"`;
    case "compute_metrics":
      return decision.metrics?.k !== undefined
        ? `Computed metrics for "${experimentName}": K=${decision.metrics.k}, Conversion=${decision.metrics.conversionRate}, FVM Lift=${decision.metrics.fvmLift}%`
        : `Computed metrics for "${experimentName}"`;
    default:
      return `Processed ${action} for experiment "${experimentName}"`;
  }
}

// Public functions for updating metrics
export function recordMetric(experimentName: string, cohort: string, metricType: "invite" | "open" | "join" | "fvm"): void {
  const key = `${experimentName}:${cohort}`;
  const metrics = metricsStore.get(key) || { invites: 0, opens: 0, joins: 0, fvms: 0, cohort };

  switch (metricType) {
    case "invite":
      metrics.invites++;
      break;
    case "open":
      metrics.opens++;
      break;
    case "join":
      metrics.joins++;
      break;
    case "fvm":
      metrics.fvms++;
      break;
  }

  metricsStore.set(key, metrics);
}

export function getExperimentStats(experimentName: string) {
  const stats: any = {};
  
  for (const [key, data] of metricsStore.entries()) {
    if (key.startsWith(`${experimentName}:`)) {
      const cohort = key.split(":")[1];
      stats[cohort] = {
        ...data,
        k: calculateK(data),
      };
    }
  }

  return stats;
}

