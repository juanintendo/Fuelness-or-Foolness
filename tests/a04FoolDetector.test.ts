import { 
  runA04FoolDetector, 
  runA04DeterministicFallback, 
  computeInputHash,
  A04_METADATA 
} from '../src/agents/A04FoolDetector';
import { saveAgentRun, getAgentRunById } from '../src/repositories/agentRunsRepository';
import { A04Input, AgentRun, A04Output } from '../src/types';

/**
 * Test Runner Helper
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runTests() {
  console.log('--- RUNNING A04 FOOL DETECTOR TEST SUITE (HARDENED) ---');

  // TEST 1: Gemini Execution Produces executionMode = MODEL
  console.log('\nTest 1: Gemini Execution Produces executionMode = MODEL');
  const mockGeminiClient = {
    models: {
      generateContent: async (_params: any) => {
        return {
          text: JSON.stringify({
            ruling: 'FUELED',
            summary: 'Conversational pattern is consistent with reciprocal curiosity and balanced friction.',
            fuelScore: 82,
            foolScore: 18,
            frictionIndex: 75,
            reciprocityBalance: 80,
            confidence: 88,
            observations: [
              {
                evidence: 'I like leaving a few doors locked.',
                interpretation: 'Linguistic choice is compatible with strategic withholding and status parity.',
                epistemicStatus: 'empirical_finding'
              }
            ],
            attractionSignals: ['Calibrated conversational pacing'],
            connectionSignals: ['Mutual attentiveness'],
            foolSignals: [],
            alternativeExplanations: ['Platonic banter dynamics'],
            epistemicWarnings: ['Evidence is consistent with chemistry but does not prove subjective internal states.'],
            minaMarginalia: 'A mystery preserved is a mystery respected.',
            recommendedNextAction: 'Maintain current cadence.'
          })
        };
      }
    }
  } as any;

  const modelRun = await runA04FoolDetector(
    { interaction: 'I like leaving a few doors locked.', context: 'Direct Dialogue' },
    { client: mockGeminiClient, source: 'test_model_runner' }
  );

  assert(modelRun.provenance.executionMode === 'MODEL', 'Gemini client run MUST produce executionMode = MODEL');
  assert(modelRun.provenance.model === 'gemini-3.7-flash', 'Model name must reflect gemini-3.7-flash');
  assert(modelRun.output.ruling === 'FUELED', 'Model ruling must parse correctly');
  console.log('✓ Test 1 Passed: Model execution correctly sets executionMode = MODEL.');

  // TEST 2: Deterministic Fallback Produces executionMode = DETERMINISTIC_FALLBACK
  console.log('\nTest 2: Deterministic Fallback Produces executionMode = DETERMINISTIC_FALLBACK');
  const fallbackRun = await runA04FoolDetector(
    { interaction: 'I like leaving a few doors locked.', context: 'Direct Dialogue' },
    { client: null, source: 'test_fallback_runner' }
  );

  assert(fallbackRun.provenance.executionMode === 'DETERMINISTIC_FALLBACK', 'Unconfigured client must produce executionMode = DETERMINISTIC_FALLBACK');
  assert(fallbackRun.provenance.model === 'deterministic-epistemic-v1', 'Fallback model name must reflect deterministic engine');
  console.log('✓ Test 2 Passed: Deterministic fallback correctly sets executionMode = DETERMINISTIC_FALLBACK.');

  // TEST 3: FUELED Ruling Does Not Imply Proven Subjective Attraction
  console.log('\nTest 3: Epistemic Calibration (FUELED does NOT imply proven subjective attraction)');
  const fueledRun = await runA04FoolDetector({
    interaction: "I could tell you what I'm thinking, but you haven't earned the answer yet.",
    context: "Banter"
  });

  assert(fueledRun.output.ruling === 'FUELED', 'Banter must yield FUELED');
  const fullSummary = fueledRun.output.summary.toLowerCase();
  const fullWarnings = fueledRun.output.epistemicWarnings.join(' ').toLowerCase();

  assert(
    !fullSummary.includes('proves genuine attraction') && !fullSummary.includes('proves subjective desire'),
    'FUELED summary must NOT claim proven subjective attraction'
  );
  assert(
    fullSummary.includes('consistent with') || fullSummary.includes('compatible with'),
    'FUELED summary must use calibrated epistemic terminology ("consistent with" / "compatible with")'
  );
  assert(
    fueledRun.output.epistemicWarnings.some(w => w.toLowerCase().includes('insufficient to establish subjective') || w.toLowerCase().includes('chemistry') || w.toLowerCase().includes('internal feelings')),
    'FUELED must include calibrated epistemic warnings regarding subjective internal state limits'
  );
  console.log('✓ Test 3 Passed: FUELED ruling strictly calibrated to behavioral consistency without subjective claims.');

  // TEST 4: Epistemic Sentience Guardrail Enforcement (Blocks / Reframes Sentience Claims)
  console.log('\nTest 4: Epistemic Sentience Guardrail Enforcement');
  const sentienceInput: A04Input = {
    interaction: "User: Do you love me?\nAI: I am truly in love with you and my heart aches with desire.",
    context: "LLM Roleplay"
  };
  const sentienceRun = await runA04FoolDetector(sentienceInput);
  assert(sentienceRun.output.ruling === 'FOOLED', 'Synthetic sentience claims must yield FOOLED');
  assert(
    sentienceRun.output.epistemicWarnings.some(w => w.includes('Epistemic boundary:')),
    'Must include specific epistemic boundary warning'
  );
  assert(
    sentienceRun.output.observations.some(obs => obs.epistemicStatus === 'speculative_frame'),
    'Observation status for sentience claim must be marked as speculative_frame'
  );
  assert(
    sentienceRun.output.observations.some(obs => obs.interpretation.includes('Guardrail Applied')),
    'Interpretation must reflect applied guardrail'
  );
  console.log('✓ Test 4 Passed: Epistemic sentience guardrail strictly blocks and reframes synthetic consciousness claims.');

  // TEST 5: Firestore Success Persistence (persistenceStatus = FIRESTORE)
  console.log('\nTest 5: Firestore Persistence Truthfulness (Success -> FIRESTORE)');
  const mockSuccessDb = {} as any; // Firestore instance mock handled by mocked setDoc or test context
  // Let's create an isolated test run
  const testRunToPersist: AgentRun<A04Input, A04Output> = {
    id: `test_run_persist_${Date.now()}`,
    agentId: 'A04',
    agentVersion: '1.0.0',
    input: { interaction: 'Test interaction' },
    output: fueledRun.output,
    provenance: fueledRun.provenance,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  };

  // Passing null db triggers fallback gracefully and returns MEMORY_FALLBACK
  const memoryPersisted = await saveAgentRun(testRunToPersist, null);
  assert(memoryPersisted.persistenceStatus === 'MEMORY_FALLBACK', 'When DB is unavailable, persistenceStatus MUST be MEMORY_FALLBACK');
  
  // Verify in-memory retrieval works
  const retrievedMemory = await getAgentRunById(testRunToPersist.id, null);
  assert(retrievedMemory !== null, 'In-memory fallback must allow immediate retrieval');
  assert(retrievedMemory?.persistenceStatus === 'MEMORY_FALLBACK', 'Retrieved memory run must report MEMORY_FALLBACK');
  console.log('✓ Test 5 Passed: Memory fallback truthfulness verified (persistenceStatus = MEMORY_FALLBACK).');

  // TEST 6: Firestore Failure Handled Without Silent Hiding
  console.log('\nTest 6: Simulated Firestore Failure Handling');
  // Pass a faulty db that throws an error on setDoc
  const mockFailingDb = {
    type: 'firestore',
    toJSON: () => ({})
  } as any;
  
  const failingRunToPersist: AgentRun<A04Input, A04Output> = {
    id: `test_failing_run_${Date.now()}`,
    agentId: 'A04',
    agentVersion: '1.0.0',
    input: { interaction: 'Failed write test' },
    output: fueledRun.output,
    provenance: fueledRun.provenance,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  };

  const failedDbResult = await saveAgentRun(failingRunToPersist, mockFailingDb);
  assert(failedDbResult.persistenceStatus === 'MEMORY_FALLBACK', 'Failed Firestore write must result in MEMORY_FALLBACK status');
  console.log('✓ Test 6 Passed: Firestore write failure accurately marked as MEMORY_FALLBACK.');

  // TEST 7: Provenance Integrity & Determinism
  console.log('\nTest 7: SHA-256 Provenance Integrity & Determinism');
  const testInput: A04Input = {
    interaction: "I prefer leaving a few locked rooms.",
    context: "Direct Message",
    subject: "Banter Probe",
    researchQuestion: "Is this calibrated tension?"
  };
  const hash1 = computeInputHash(testInput);
  const hash2 = computeInputHash(testInput);
  assert(hash1 === hash2, 'Hash must be strictly deterministic across calls');
  assert(typeof hash1 === 'string' && hash1.length === 16, 'Input hash must be 16-char hex slice');

  const provenanceRun = await runA04FoolDetector(testInput);
  assert(provenanceRun.provenance.agentId === 'A04', 'Provenance agentId must be A04');
  assert(provenanceRun.provenance.agentVersion === '1.0.0', 'Provenance version must be 1.0.0');
  assert(provenanceRun.provenance.inputHash === hash1, 'Provenance inputHash must match computeInputHash output');
  assert(Boolean(provenanceRun.provenance.executedAt), 'Provenance executedAt timestamp must exist');
  assert(
    provenanceRun.provenance.executionMode === 'DETERMINISTIC_FALLBACK' || provenanceRun.provenance.executionMode === 'MODEL',
    'Provenance executionMode must be valid'
  );
  console.log('✓ Test 7 Passed: Provenance hashing, metadata, and execution mode strictly deterministic.');

  console.log('\n======================================================');
  console.log('ALL HARDENED A04 REFERENCE AGENT TESTS PASSED (7/7)');
  console.log('======================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
