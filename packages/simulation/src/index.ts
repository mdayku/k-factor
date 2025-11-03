/**
 * Simulation Package - Main Exports
 */

export { UserGenerator, type SyntheticUser, type Persona } from "./user-generator.js";
export { 
  BehaviorEngine, 
  CONTROL_CONFIG, 
  TREATMENT_CONFIG,
  type UserAction,
  type UserJourney,
  type TimedAction,
  type BehaviorConfig
} from "./behavior-engine.js";
export { EventGenerator, type SimulationEvent } from "./event-generator.js";
export { 
  CohortSimulator,
  type CohortConfig,
  type CohortResults,
  type ExperimentResults
} from "./cohort-simulator.js";
export { main as runSimulation } from "./runner.js";

