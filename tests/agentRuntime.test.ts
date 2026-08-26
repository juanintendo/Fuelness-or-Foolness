import { 
  executeAgentPipeline, 
  computeStableInputHash, 
  buildAgentProvenance,
  validateNumberRange,
  validateEnumField,
  validateStringArray,
  AgentMetadata,
  AgentExecutionSpec,
  AgentValidationError,
  AgentValidationResult
} from '../src/agents/runtime';
import { saveAgentRun, getAgentRunById, inMemoryRuns } from '../src/repositories/agentRunsRepository';
import { AgentRun } from '../src/types';

/**
 * Minimal Assertion Helper
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runRuntimeTests() {
  console.log('--- RUNNING SHARED AGENT RUNTIME FOUNDATION TEST SUITE (PHASE 4.2) ---');

  // Define a test agent specification to verify generic runtime mechanics
  interface TestAgentInput {
    text: string;
    threshold?: number;
    userId?: string;
  }

  interface TestAgentOutput {
    verdict: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    score: number;
    tags: string[];
    notes: string;
  }

  const TEST_METADATA: AgentMetadata = {
    agentId: 'A00_TEST',
    name: 'Test Instrumentation Agent',
    version: '1.0.0',
    role: 'Test agent verifying runtime foundation',
    designation: 'INST-00 // RUNTIME_VERIFIER',
    epistemicPosture: 'empirical_test',
    coreQuestion: 'Does the runtime contract hold?',
    mandate: 'Validate shared execution, validation, provenance, and persistence.'
  };

  const fallbackTestEngine = (input: TestAgentInput): TestAgentOutput => {
    return {
      verdict: 'NEUTRAL',
      score: 50,
      tags: ['fallback_tag'],
      notes: `Deterministic fallback for: ${input.text}`
    };
  };

  const testValidator = (raw: unknown, fallback: TestAgentOutput): AgentValidationResult<TestAgentOutput> => {
    const errors: AgentValidationError[] = [];
    if (!raw || typeof raw !== 'object') {
      errors.push({ field: 'root', message: 'Raw output is not an object', receivedValue: raw });
      return { isValid: false, data: fallback, errors, warnings: [] };
    }

    const parsed = raw as Partial<TestAgentOutput>;
    const verdict = validateEnumField<'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'>(
      parsed.verdict,
      ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] as const,
      fallback.verdict,
      'verdict',
      errors
    );
    const score = validateNumberRange(parsed.score, 0, 100, fallback.score, 'score', errors);
    const tags = validateStringArray(parsed.tags, fallback.tags);
    const notes = typeof parsed.notes === 'string' ? parsed.notes : fallback.notes;

    return {
      isValid: errors.length === 0,
      data: { verdict, score, tags, notes },
      errors,
      warnings: []
    };
  };

  const testExecutionSpec: AgentExecutionSpec<TestAgentInput, TestAgentOutput> = {
    metadata: TEST_METADATA,
    defaultModel: 'gemini-test-model',
    fallbackModel: 'test-fallback-engine-v1',
    defaultEpistemicStatus: 'ADVERSARIAL_AUDIT',
    executeFallback: fallbackTestEngine,
    executeModel: async (input: TestAgentInput, client: any, _model: string) => {
      return client.execute(input);
    },
    validateAndSanitize: testValidator
  };

  // TEST 1: Agent Metadata Survives Execution
  console.log('\nTest 1: Agent Metadata Survives Execution');
  const metaRun = await executeAgentPipeline(testExecutionSpec, { text: 'Testing metadata preservation' });
  assert(metaRun.agentId === 'A00_TEST', 'Run agentId must match specification metadata');
  assert(metaRun.agentVersion === '1.0.0', 'Run agentVersion must match specification metadata');
  assert(metaRun.provenance.agentId === 'A00_TEST', 'Provenance agentId must match metadata');
  assert(metaRun.provenance.agentVersion === '1.0.0', 'Provenance agentVersion must match metadata');
  console.log('✓ Test 1 Passed: Agent identity & version metadata accurately preserved.');

  // TEST 2: Execution Mode Survives Execution (MODEL and DETERMINISTIC_FALLBACK)
  console.log('\nTest 2: Execution Mode Survives Execution (MODEL vs DETERMINISTIC_FALLBACK)');
  // 2a. Fallback mode
  const fallbackRun = await executeAgentPipeline(testExecutionSpec, { text: 'Fallback run' }, { client: null });
  assert(fallbackRun.provenance.executionMode === 'DETERMINISTIC_FALLBACK', 'Unconfigured client must set executionMode = DETERMINISTIC_FALLBACK');
  assert(fallbackRun.provenance.model === 'test-fallback-engine-v1', 'Fallback model name must match fallbackModel configuration');
  assert(fallbackRun.output.verdict === 'NEUTRAL', 'Fallback output must be produced');

  // 2b. Model mode
  const mockClient = {
    execute: async (_input: TestAgentInput) => ({
      verdict: 'POSITIVE',
      score: 95,
      tags: ['synthetic_resonance'],
      notes: 'Model verified output'
    })
  };
  const modelRun = await executeAgentPipeline(testExecutionSpec, { text: 'Model run' }, { client: mockClient });
  assert(modelRun.provenance.executionMode === 'MODEL', 'Model client execution must set executionMode = MODEL');
  assert(modelRun.provenance.model === 'gemini-test-model', 'Model name must match requested or default model');
  assert(modelRun.output.verdict === 'POSITIVE', 'Model output must be correctly parsed');
  assert(modelRun.output.score === 95, 'Model numeric score must be parsed');
  console.log('✓ Test 2 Passed: Execution mode truthfulness strictly maintained across MODEL and DETERMINISTIC_FALLBACK.');

  // TEST 3: Provenance Integrity (Stable Input Hashing, Timestamps, Source)
  console.log('\nTest 3: Provenance Survives Execution with Deterministic Hashing');
  const inputA = { text: 'Order invariance test', threshold: 10 };
  const inputB = { threshold: 10, text: 'Order invariance test' };
  const hashA = computeStableInputHash(inputA);
  const hashB = computeStableInputHash(inputB);
  assert(hashA === hashB, 'Input hashing must be stable regardless of object key order');
  assert(modelRun.provenance.inputHash.length === 16, 'Input hash must be a 16-character SHA-256 slice');
  assert(typeof modelRun.provenance.executedAt === 'string', 'ExecutedAt ISO timestamp must exist');
  assert(modelRun.provenance.epistemicStatus === 'ADVERSARIAL_AUDIT', 'Epistemic status must be recorded in provenance');
  console.log('✓ Test 3 Passed: Deterministic provenance hashing and metadata verified.');

  // TEST 4: Persistence Status Survives Execution (FIRESTORE vs MEMORY_FALLBACK)
  console.log('\nTest 4: Persistence Status Survives Execution');
  // Passing null db explicitly forces MEMORY_FALLBACK
  const persistedMemory = await saveAgentRun(modelRun, null);
  assert(persistedMemory.persistenceStatus === 'MEMORY_FALLBACK', 'When DB is unavailable, persistenceStatus MUST be MEMORY_FALLBACK');
  
  const retrievedMemory = await getAgentRunById(persistedMemory.id, null);
  assert(retrievedMemory !== null, 'In-memory fallback must allow immediate retrieval');
  assert(retrievedMemory?.id === persistedMemory.id, 'Retrieved run ID must match');
  assert(retrievedMemory?.persistenceStatus === 'MEMORY_FALLBACK', 'Retrieved item must report MEMORY_FALLBACK');
  console.log('✓ Test 4 Passed: Persistence status observable and truthful.');

  // TEST 5: Validation Failures are Explicit and Clamped
  console.log('\nTest 5: Explicit Validation Failures, Clamping & Partial Status');
  const faultyClient = {
    execute: async (_input: TestAgentInput) => ({
      verdict: 'INVALID_ENUM_VALUE', // Invalid enum
      score: 999, // Out of bounds number (> 100)
      tags: 'not_an_array', // Invalid array
      notes: 12345 // Non-string
    })
  };

  const validationRun = await executeAgentPipeline(testExecutionSpec, { text: 'Testing faulty payload' }, { client: faultyClient });
  assert(validationRun.status === 'PARTIAL', 'Validation errors in model execution must mark status as PARTIAL');
  assert(validationRun.output.verdict === 'NEUTRAL', 'Invalid enum must fallback to default enum value');
  assert(validationRun.output.score === 100, 'Score of 999 must be clamped to max bounds of 100');
  assert(Array.isArray(validationRun.output.tags), 'Tags must be normalized to array');
  console.log('✓ Test 5 Passed: Explicit schema validation catches malformed data, clamps ranges, and records PARTIAL run status.');

  // TEST 6: Helper primitives validation tests
  console.log('\nTest 6: Runtime Validation Primitives');
  const errList: AgentValidationError[] = [];
  const clampedLow = validateNumberRange(-50, 0, 100, 50, 'testMin', errList);
  assert(clampedLow === 0, 'Negative numbers clamped to min');
  const clampedHigh = validateNumberRange(150, 0, 100, 50, 'testMax', errList);
  assert(clampedHigh === 100, 'Over-range numbers clamped to max');
  const nanHandled = validateNumberRange('invalid_number', 0, 100, 42, 'testNan', errList);
  assert(nanHandled === 42, 'Non-numeric value uses fallback');
  assert(errList.length === 1 && errList[0].field === 'testNan', 'Error list captures failed field');
  console.log('✓ Test 6 Passed: Validation primitives behave deterministically.');

  console.log('\n======================================================');
  console.log('ALL SHARED AGENT RUNTIME FOUNDATION TESTS PASSED (6/6)');
  console.log('======================================================\n');
  process.exit(0);
}

runRuntimeTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
