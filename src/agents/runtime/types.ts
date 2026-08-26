import { EpistemicStatus } from '../../types';

export type AgentExecutionMode = 'MODEL' | 'DETERMINISTIC_FALLBACK';
export type AgentPersistenceStatus = 'FIRESTORE' | 'MEMORY_FALLBACK';
export type AgentRunStatus = 'SUCCESS' | 'FAILED' | 'PARTIAL';

export interface AgentMetadata {
  agentId: string;
  name: string;
  version: string;
  role: string;
  designation: string;
  epistemicPosture: string;
  coreQuestion: string;
  mandate: string;
}

export interface AgentRunProvenance {
  agentId: string;
  agentVersion: string;
  model: string;
  executionMode: AgentExecutionMode;
  executedAt: string; // ISO 8601
  inputHash: string; // SHA-256 hash of input
  source: string;
  epistemicStatus: EpistemicStatus;
}

export interface AgentRun<TInput = unknown, TOutput = unknown> {
  id: string;
  agentId: string;
  agentVersion: string;
  input: TInput;
  output: TOutput;
  provenance: AgentRunProvenance;
  status: AgentRunStatus;
  persistenceStatus?: AgentPersistenceStatus;
  createdAt: string;
  userId?: string;
}

export interface AgentValidationError {
  field: string;
  message: string;
  receivedValue?: unknown;
}

export interface AgentValidationResult<TOutput> {
  isValid: boolean;
  data: TOutput;
  errors: AgentValidationError[];
  warnings: string[];
}

export interface AgentRunnerOptions {
  client?: any | null; // GoogleGenAI client instance or null
  source?: string;
  modelName?: string;
}
