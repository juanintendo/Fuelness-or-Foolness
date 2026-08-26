import { 
  AgentMetadata, 
  AgentRun, 
  AgentRunnerOptions, 
  AgentValidationResult,
  AgentExecutionMode
} from './types';
import { computeStableInputHash, buildAgentProvenance } from './provenance';
import { EpistemicStatus } from '../../types';

export interface AgentExecutionSpec<TInput, TOutput> {
  metadata: AgentMetadata;
  defaultModel: string;
  fallbackModel?: string;
  defaultEpistemicStatus: EpistemicStatus;
  
  // Deterministic fallback execution
  executeFallback: (input: TInput) => TOutput;
  
  // Model execution function (optional, invokes Gemini client)
  executeModel?: (input: TInput, client: any, modelName: string) => Promise<unknown>;
  
  // Validation and epistemic calibration function
  validateAndSanitize: (rawOutput: unknown, fallbackOutput: TOutput) => AgentValidationResult<TOutput>;
}

/**
 * Standard reference pipeline executing:
 * typed input -> execution (model or deterministic fallback) -> validation & epistemic calibration -> provenance -> result artifact
 */
export async function executeAgentPipeline<TInput, TOutput>(
  spec: AgentExecutionSpec<TInput, TOutput>,
  input: TInput,
  options?: AgentRunnerOptions
): Promise<AgentRun<TInput, TOutput>> {
  const executedAt = new Date().toISOString();
  const inputHash = computeStableInputHash(input);
  const source = options?.source || `workbench_${spec.metadata.agentId.toLowerCase()}`;
  const client = options?.client;
  const requestedModel = options?.modelName || spec.defaultModel;
  const fallbackModel = spec.fallbackModel || `${spec.metadata.agentId.toLowerCase()}-deterministic-fallback`;

  let rawOutput: unknown;
  let modelName = requestedModel;
  let executionMode: AgentExecutionMode = 'DETERMINISTIC_FALLBACK';

  const fallbackOutput = spec.executeFallback(input);

  if (client && spec.executeModel) {
    try {
      rawOutput = await spec.executeModel(input, client, modelName);
      executionMode = 'MODEL';
    } catch (err) {
      console.warn(`[Agent ${spec.metadata.agentId}] Model execution failed. Falling back to deterministic engine:`, err);
      modelName = fallbackModel;
      executionMode = 'DETERMINISTIC_FALLBACK';
      rawOutput = fallbackOutput;
    }
  } else {
    modelName = fallbackModel;
    executionMode = 'DETERMINISTIC_FALLBACK';
    rawOutput = fallbackOutput;
  }

  // Schema validation & Epistemic Calibration
  const validation = spec.validateAndSanitize(rawOutput, fallbackOutput);
  const finalOutput = validation.data;

  const provenance = buildAgentProvenance({
    agentId: spec.metadata.agentId,
    agentVersion: spec.metadata.version,
    model: modelName,
    executionMode,
    executedAt,
    inputHash,
    source,
    epistemicStatus: spec.defaultEpistemicStatus
  });

  const runId = `run_${spec.metadata.agentId.toLowerCase()}_${Date.now()}_${inputHash.slice(0, 6)}`;

  return {
    id: runId,
    agentId: spec.metadata.agentId,
    agentVersion: spec.metadata.version,
    input,
    output: finalOutput,
    provenance,
    status: validation.errors.length > 0 && executionMode === 'MODEL' ? 'PARTIAL' : 'SUCCESS',
    createdAt: executedAt,
    userId: (input as any)?.userId
  };
}
