import crypto from 'crypto';
import { AgentRunProvenance, AgentExecutionMode } from './types';
import { EpistemicStatus } from '../../types';

/**
 * Computes a deterministic SHA-256 hash of any input payload.
 * Normalizes input objects and keys to ensure consistent hashing.
 */
export function computeStableInputHash(input: unknown): string {
  const normalize = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj.trim();
    if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
    if (Array.isArray(obj)) return obj.map(normalize);
    if (typeof obj === 'object') {
      const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
      const normalizedObj: Record<string, unknown> = {};
      for (const key of sortedKeys) {
        normalizedObj[key] = normalize((obj as Record<string, unknown>)[key]);
      }
      return normalizedObj;
    }
    return String(obj);
  };

  const payload = JSON.stringify(normalize(input));
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

/**
 * Constructs a standardized provenance record for an agent execution run.
 */
export function buildAgentProvenance(params: {
  agentId: string;
  agentVersion: string;
  model: string;
  executionMode: AgentExecutionMode;
  executedAt: string;
  inputHash: string;
  source?: string;
  epistemicStatus?: EpistemicStatus;
}): AgentRunProvenance {
  return {
    agentId: params.agentId,
    agentVersion: params.agentVersion,
    model: params.model,
    executionMode: params.executionMode,
    executedAt: params.executedAt,
    inputHash: params.inputHash,
    source: params.source || 'agent_runner',
    epistemicStatus: params.epistemicStatus || 'ADVERSARIAL_AUDIT'
  };
}
