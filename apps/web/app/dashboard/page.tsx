"use client";

import { useState, useEffect } from "react";

// Types for our API responses
interface KFactorData {
  kFactor: number;
  invitesPerUser: number;
  inviteConversionRate: number;
  invitesSent: number;
  invitesAccepted: number;
  totalUsers: number;
  cohort: string;
  cohortBreakdown?: {
    control: {
      kFactor: number;
      invitesPerUser: number;
      conversionRate: number;
    };
    treatment: {
      kFactor: number;
      invitesPerUser: number;
      conversionRate: number;
    };
    lift: number;
  };
}

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  conversionFromPrevious: number | null;
}

interface FunnelData {
  funnel: FunnelStage[];
  summary: {
    totalInvitesSent: number;
    totalFvmReached: number;
    overallConversion: number;
  };
}

interface RetentionData {
  retention: {
    d1: { retained: number; total: number; rate: number };
    d7: { retained: number; total: number; rate: number };
    d28: { retained: number; total: number; rate: number };
  };
}

interface CohortComparisonData {
  control: any;
  treatment: any;
  lifts: {
    kFactor: number;
    fvmRate: number;
    d1Retention: number;
    d7Retention: number;
  };
  summary: {
    kFactorLift: number;
    fvmLift: number;
    retentionLift: number;
    isSignificant: boolean;
    targetsMet: {
      kFactorAbove120: boolean;
      fvmLiftAbove20: boolean;
      retentionLiftAbove10: boolean;
    };
  };
}

interface AgentDecision {
  id: string;
  timestamp: string;
  agentType: string;
  userId: string;
  decision: {
    action: string;
    rationale: string;
    confidence: number;
    context: any;
  };
}

interface AgentLogsData {
  decisions: AgentDecision[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  stats: Array<{
    agentType: string;
    totalDecisions: number;
  }>;
}

interface EventData {
  events: Array<{
    id: string;
    type: string;
    userId: string;
    createdAt: string;
    metadata: any;
  }>;
  pagination: {
    total: number;
  };
}

export default function Dashboard() {
  // Filter state
  const [simulationId, setSimulationId] = useState<string>("");
  const [selectedCohort, setSelectedCohort] = useState<string>("all");
  
  // Data state
  const [kFactorData, setKFactorData] = useState<KFactorData | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [retentionData, setRetentionData] = useState<RetentionData | null>(null);
  const [cohortData, setCohortData] = useState<CohortComparisonData | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLogsData | null>(null);
  const [fraudEvents, setFraudEvents] = useState<EventData | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View toggles
  const [showAgentLogs, setShowAgentLogs] = useState(false);
  const [showFraudMonitoring, setShowFraudMonitoring] = useState(false);

  // Fetch all metrics
  useEffect(() => {
    fetchAllMetrics();
  }, [simulationId, selectedCohort]);

  // Fetch agent logs when toggled
  useEffect(() => {
    if (showAgentLogs && !agentLogs) {
      fetchAgentLogs();
    }
  }, [showAgentLogs]);

  // Fetch fraud events when toggled
  useEffect(() => {
    if (showFraudMonitoring && !fraudEvents) {
      fetchFraudEvents();
    }
  }, [showFraudMonitoring]);

  const fetchAllMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (simulationId) params.append("simulationId", simulationId);
      if (selectedCohort !== "all") params.append("cohort", selectedCohort);
      
      const queryString = params.toString();
      
      // Fetch all metrics in parallel
      const [kFactor, funnel, retention, cohort] = await Promise.all([
        fetch(`/api/metrics/k-factor?${queryString}`).then(r => r.json()),
        fetch(`/api/metrics/funnel?${queryString}`).then(r => r.json()),
        fetch(`/api/metrics/retention?${queryString}`).then(r => r.json()),
        selectedCohort === "all" 
          ? fetch(`/api/metrics/cohort-comparison?${params.toString().replace('cohort=all', '')}`).then(r => r.json())
          : Promise.resolve(null)
      ]);
      
      setKFactorData(kFactor);
      setFunnelData(funnel);
      setRetentionData(retention);
      setCohortData(cohort);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (simulationId) params.append("simulationId", simulationId);
      params.append("limit", "20");
      
      const data = await fetch(`/api/agents/decisions?${params.toString()}`).then(r => r.json());
      setAgentLogs(data);
    } catch (err) {
      console.error("Failed to fetch agent logs:", err);
    }
  };

  const fetchFraudEvents = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", "50");
      
      const data = await fetch(`/api/fraud/events?${params.toString()}`).then(r => r.json());
      setFraudEvents(data);
    } catch (err) {
      console.error("Failed to fetch fraud events:", err);
    }
  };

  return (
    <div style={{ 
      padding: "24px", 
      maxWidth: "1400px", 
      margin: "0 auto",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "8px" }}>
          📊 K-Factor Metrics Dashboard
        </h1>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Real-time analytics from database • Phase 3 Complete ✅
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: "flex", 
        gap: "16px", 
        marginBottom: "32px",
        padding: "16px",
        background: "#f5f5f5",
        borderRadius: "8px"
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Simulation ID (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., sim-1762196864996"
            value={simulationId}
            onChange={(e) => setSimulationId(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Cohort
          </label>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              background: "white"
            }}
          >
            <option value="all">All (with comparison)</option>
            <option value="control">Control Only</option>
            <option value="treatment">Treatment Only</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={fetchAllMetrics}
            disabled={loading}
            style={{
              padding: "8px 24px",
              background: loading ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={{
          padding: "16px",
          background: "#fee",
          border: "1px solid #fcc",
          borderRadius: "8px",
          marginBottom: "24px",
          color: "#c00"
        }}>
          ❌ Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "64px", color: "#666" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <div>Loading metrics from database...</div>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* K-Factor Overview */}
          {kFactorData && (
            <div style={{
              padding: "24px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                🎯 K-Factor Metrics
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <MetricCard
                  label="K-Factor"
                  value={(kFactorData.kFactor ?? 0).toFixed(3)}
                  isGood={(kFactorData.kFactor ?? 0) >= 1.0}
                />
                <MetricCard
                  label="Invites Per User"
                  value={(kFactorData.invitesPerUser ?? 0).toFixed(2)}
                />
                <MetricCard
                  label="Conversion Rate"
                  value={`${((kFactorData.inviteConversionRate ?? 0) * 100).toFixed(1)}%`}
                />
                <MetricCard
                  label="Total Users"
                  value={(kFactorData.totalUsers ?? 0).toString()}
                />
              </div>

              {kFactorData.cohortBreakdown && kFactorData.cohortBreakdown.control && kFactorData.cohortBreakdown.treatment && (
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e0e0e0" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                    Cohort Breakdown
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Control</div>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {(kFactorData.cohortBreakdown.control.kFactor ?? 0).toFixed(3)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>Target = 0.8</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Treatment</div>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0070f3" }}>
                        {(kFactorData.cohortBreakdown.treatment.kFactor ?? 0).toFixed(3)}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>Target = 1.2</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Lift</div>
                      <div style={{ fontSize: "24px", fontWeight: "bold", color: (kFactorData.cohortBreakdown.lift ?? 0) > 0 ? "#0a0" : "#c00" }}>
                        {(kFactorData.cohortBreakdown.lift ?? 0) > 0 ? "+" : ""}{(kFactorData.cohortBreakdown.lift ?? 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Funnel */}
          {funnelData && funnelData.funnel && Array.isArray(funnelData.funnel) && (
            <div style={{
              padding: "24px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                🔁 Viral Funnel
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {funnelData.funnel.map((stage, idx) => (
                  <div key={stage.stage} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "12px",
                    background: "#f9f9f9",
                    borderRadius: "4px"
                  }}>
                    <div style={{ minWidth: "150px", fontSize: "14px", fontWeight: "500" }}>
                      {stage.stage.replace(".", " → ")}
                    </div>
                    <div style={{ flex: 1, height: "24px", background: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${stage.percentage}%`,
                        background: `hsl(${200 + idx * 20}, 70%, 50%)`,
                        transition: "width 0.3s"
                      }} />
                    </div>
                    <div style={{ minWidth: "80px", textAlign: "right", fontSize: "14px", fontWeight: "500" }}>
                      {stage.count} ({stage.percentage.toFixed(1)}%)
                    </div>
                    {stage.conversionFromPrevious !== null && (
                      <div style={{ minWidth: "60px", textAlign: "right", fontSize: "12px", color: "#666" }}>
                        {stage.conversionFromPrevious.toFixed(1)}% ↓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retention */}
          {retentionData && retentionData.retention && (
            <div style={{
              padding: "24px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
                📈 Retention Rates
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {retentionData.retention.d1 && (
                  <RetentionCard
                    label="Day 1"
                    rate={retentionData.retention.d1.rate}
                    retained={retentionData.retention.d1.retained}
                    total={retentionData.retention.d1.total}
                  />
                )}
                {retentionData.retention.d7 && (
                  <RetentionCard
                    label="Day 7"
                    rate={retentionData.retention.d7.rate}
                    retained={retentionData.retention.d7.retained}
                    total={retentionData.retention.d7.total}
                  />
                )}
                {retentionData.retention.d28 && (
                  <RetentionCard
                    label="Day 28"
                    rate={retentionData.retention.d28.rate}
                    retained={retentionData.retention.d28.retained}
                    total={retentionData.retention.d28.total}
                  />
                )}
              </div>
            </div>
          )}


          {/* Agent Logs Toggle */}
          <div style={{
            padding: "16px",
            background: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => setShowAgentLogs(!showAgentLogs)}>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
              🤖 Agent Decision Logs {showAgentLogs ? "▼" : "▶"}
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              Click to {showAgentLogs ? "hide" : "view"} MCP agent decisions with rationales
            </p>
          </div>

          {/* Agent Logs Content */}
          {showAgentLogs && agentLogs && (
            <div style={{
              padding: "24px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              {agentLogs.stats && agentLogs.stats.length > 0 && (
                <div style={{ marginBottom: "24px", display: "flex", gap: "16px" }}>
                  {agentLogs.stats.map(stat => (
                    <div key={stat.agentType} style={{
                      padding: "12px",
                      background: "#f9f9f9",
                      borderRadius: "4px",
                      flex: 1
                    }}>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {stat.agentType}
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {stat.totalDecisions}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {agentLogs.decisions && agentLogs.decisions.slice(0, 10).map(decision => (
                  <div key={decision.id} style={{
                    padding: "16px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    borderLeft: "4px solid #0070f3"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {decision.agentType} → {decision.decision.action}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        {new Date(decision.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                      <strong>Rationale:</strong> {decision.decision.rationale}
                    </div>
                    {decision.decision.confidence && (
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        Confidence: {(decision.decision.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {agentLogs.decisions && agentLogs.decisions.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#999" }}>
                  No agent decisions found for the selected filters.
                </div>
              )}
            </div>
          )}

          {/* Fraud Monitoring Toggle */}
          <div style={{
            padding: "16px",
            background: "#f0f0f0",
            border: "1px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => setShowFraudMonitoring(!showFraudMonitoring)}>
            <h2 style={{ fontSize: "18px", fontWeight: "600" }}>
              🛡️ Fraud & Compliance Monitoring {showFraudMonitoring ? "▼" : "▶"}
            </h2>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              Click to {showFraudMonitoring ? "hide" : "view"} fraud detection events and compliance issues
            </p>
          </div>

          {/* Fraud Events Content */}
          {showFraudMonitoring && fraudEvents && (
            <div style={{
              padding: "24px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                    Fraud Detection Events
                  </h3>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    Total events: {fraudEvents.pagination?.total ?? 0}
                  </p>
                </div>
                <div style={{
                  padding: "8px 16px",
                  background: (fraudEvents.pagination?.total ?? 0) === 0 ? "#e8f5e9" : "#fff3e0",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}>
                  {(fraudEvents.pagination?.total ?? 0) === 0 ? "✅ No Issues" : `⚠️ ${fraudEvents.pagination?.total} Events`}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {fraudEvents.events && fraudEvents.events.slice(0, 10).map(event => (
                  <div key={event.id} style={{
                    padding: "16px",
                    background: "#fff3e0",
                    borderRadius: "4px",
                    borderLeft: "4px solid #ff9800"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontWeight: "600", fontSize: "14px" }}>
                        {event.type}
                      </div>
                      <div style={{ fontSize: "12px", color: "#999" }}>
                        {new Date(event.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#555" }}>
                      User: {event.userId}
                    </div>
                    {event.metadata && (
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                        <pre style={{ margin: 0, fontFamily: "monospace" }}>
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {fraudEvents.events && fraudEvents.events.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#999" }}>
                  ✅ No fraud events detected. System is healthy!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper components
function MetricCard({ label, value, target, isGood }: { 
  label: string; 
  value: string; 
  target?: string; 
  isGood?: boolean;
}) {
  return (
    <div style={{ 
      padding: "16px", 
      background: isGood !== undefined ? (isGood ? "#e8f5e9" : "#ffebee") : "#f9f9f9",
      borderRadius: "4px" 
    }}>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{label}</div>
      <div style={{ 
        fontSize: "28px", 
        fontWeight: "bold",
        color: isGood !== undefined ? (isGood ? "#2e7d32" : "#c62828") : "#000"
      }}>
        {value}
      </div>
      {target && (
        <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
          Target: {target}
        </div>
      )}
    </div>
  );
}

function RetentionCard({ label, rate, retained, total }: {
  label: string;
  rate: number;
  retained: number;
  total: number;
}) {
  return (
    <div style={{ padding: "16px", background: "#f9f9f9", borderRadius: "4px" }}>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{label}</div>
      <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "4px" }}>
        {rate.toFixed(1)}%
      </div>
      <div style={{ fontSize: "12px", color: "#999" }}>
        {retained} / {total} users
      </div>
    </div>
  );
}

function LiftCard({ label, lift, target }: {
  label: string;
  lift: number;
  target: number;
}) {
  const safeLift = lift ?? 0;
  const meetsTarget = safeLift >= target;
  return (
    <div style={{ 
      padding: "16px", 
      background: meetsTarget ? "#e8f5e9" : "#ffebee",
      borderRadius: "4px" 
    }}>
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{label}</div>
      <div style={{ 
        fontSize: "32px", 
        fontWeight: "bold",
        color: meetsTarget ? "#2e7d32" : "#c62828"
      }}>
        {safeLift > 0 ? "+" : ""}{safeLift.toFixed(1)}%
      </div>
      <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
        Target: {target > 0 ? "+" : ""}{target}%
      </div>
    </div>
  );
}

