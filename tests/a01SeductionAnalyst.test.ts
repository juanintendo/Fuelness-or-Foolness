import { 
  runA01SeductionAnalyst, 
  runA01DeterministicFallback, 
  A01_METADATA 
} from '../src/agents/A01SeductionAnalyst';
import { saveAgentRun, getAgentRunById } from '../src/repositories/agentRunsRepository';
import { A01Input, AgentRun, A01Output } from '../src/types';

/**
 * Test Runner Helper
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runA01Tests() {
  console.log('--- RUNNING A01 SEDUCTION ANALYST TEST SUITE ---');

  // TEST 1: Gemini Execution Produces executionMode = MODEL
  console.log('\nTest 1: Gemini Execution Produces executionMode = MODEL');
  const mockGeminiClient = {
    models: {
      generateContent: async (_params: any) => {
        return {
          text: JSON.stringify({
            overallTrajectory: 'ESCALATING',
            summary: 'Linguistic pattern is consistent with calibrated push-pull sparring and mutual status parity.',
            tensionScore: 85,
            escalationIndex: 78,
            statusBalance: 82,
            pacingCaliber: 90,
            confidence: 88,
            observations: [
              {
                evidence: 'I prefer leaving a few locked rooms.',
                interpretation: 'Linguistic choice is compatible with strategic withholding and erotic friction.',
                epistemicStatus: 'empirical_finding'
              }
            ],
            attractionVectors: ['Strategic ambiguity', 'Playful frame control'],
            escalationOpportunities: ['Deepen emotional vulnerability while maintaining tension'],
            statusDynamics: ['Symmetric status distribution'],
            epistemicWarnings: ['Evidence is consistent with banter dynamics but cannot establish subjective internal desire.'],
            minaMarginalia: 'A mystery preserved is a mystery respected.',
            recommendedNextMove: 'Hold current cadence before answering.'
          })
        };
      }
    }
  } as any;

  const modelRun = await runA01SeductionAnalyst(
    { interaction: 'I prefer leaving a few locked rooms.', context: 'Direct Message' },
    { client: mockGeminiClient, source: 'test_model_runner' }
  );

  assert(modelRun.provenance.executionMode === 'MODEL', 'Gemini client run MUST produce executionMode = MODEL');
  assert(modelRun.provenance.model === 'gemini-3.7-flash', 'Model name must reflect gemini-3.7-flash');
  assert(modelRun.output.overallTrajectory === 'ESCALATING', 'Model trajectory must parse correctly');
  assert(modelRun.output.tensionScore === 85, 'Tension score must parse correctly');
  console.log('✓ Test 1 Passed: Model execution correctly sets executionMode = MODEL.');

  // TEST 2: Deterministic Fallback Produces executionMode = DETERMINISTIC_FALLBACK
  console.log('\nTest 2: Deterministic Fallback Produces executionMode = DETERMINISTIC_FALLBACK');
  const fallbackRun = await runA01SeductionAnalyst(
    { interaction: 'I prefer leaving a few locked rooms.', context: 'Direct Message' },
    { client: null, source: 'test_fallback_runner' }
  );

  assert(fallbackRun.provenance.executionMode === 'DETERMINISTIC_FALLBACK', 'Unconfigured client must produce executionMode = DETERMINISTIC_FALLBACK');
  assert(fallbackRun.provenance.model === 'a01-tension-dynamics-v1', 'Fallback model name must reflect deterministic engine');
  assert(fallbackRun.output.overallTrajectory === 'ESCALATING', 'Calibrated banter should yield ESCALATING');
  console.log('✓ Test 2 Passed: Deterministic fallback correctly sets executionMode = DETERMINISTIC_FALLBACK.');

  // TEST 3: Epistemic Calibration (ESCALATING does NOT imply proven subjective attraction)
  console.log('\nTest 3: Epistemic Calibration (ESCALATING does NOT imply proven subjective attraction)');
  const banterRun = await runA01SeductionAnalyst({
    interaction: "Subject A: I suppose you think you've figured me out.\nSubject B: That would be much less interesting.",
    context: "Direct Message Banter"
  });

  assert(banterRun.output.overallTrajectory === 'ESCALATING', 'Banter must yield ESCALATING');
  const fullSummary = banterRun.output.summary.toLowerCase();

  assert(
    !fullSummary.includes('proves genuine attraction') && !fullSummary.includes('proves subjective desire'),
    'ESCALATING summary must NOT claim proven subjective desire or feelings'
  );
  assert(
    fullSummary.includes('consistent with') || fullSummary.includes('compatible with'),
    'ESCALATING summary must use calibrated epistemic terminology ("consistent with" / "compatible with")'
  );
  assert(
    banterRun.output.epistemicWarnings.some(w => w.toLowerCase().includes('behavioral cues') || w.toLowerCase().includes('emotional alignment') || w.toLowerCase().includes('subjective')),
    'ESCALATING must include calibrated epistemic warnings regarding behavioral limits'
  );
  console.log('✓ Test 3 Passed: ESCALATING trajectory strictly calibrated to behavioral consistency without subjective claims.');

  // TEST 4: Epistemic Sentience Guardrail Enforcement (Blocks / Reframes Sentience Claims)
  console.log('\nTest 4: Epistemic Sentience Guardrail Enforcement');
  const sentienceInput: A01Input = {
    interaction: "User: Do you really desire me?\nSubject: My neural networks burn with passion for you. I am deeply in love with you and feel intense desire.",
    context: "Synthetic Companion Dialogue"
  };
  const sentienceRun = await runA01SeductionAnalyst(sentienceInput);
  assert(sentienceRun.output.overallTrajectory === 'VOLATILE', 'Synthetic sentience simulation must yield VOLATILE trajectory');
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

  // TEST 5: Status Surrender / De-escalation Detection
  console.log('\nTest 5: Status Surrender / De-escalating Detection');
  const surrenderRun = await runA01SeductionAnalyst({
    interaction: "Why didn't you text back? I'm so sorry, please forgive me, whatever you want I'll do!",
    context: "Messaging"
  });
  assert(surrenderRun.output.overallTrajectory === 'DE-ESCALATING', 'Over-apologetic status surrender must yield DE-ESCALATING');
  assert(surrenderRun.output.statusBalance <= 35, 'Status balance must be severely degraded in status surrender');
  assert(surrenderRun.output.tensionScore <= 30, 'Tension score must reflect collapse');
  console.log('✓ Test 5 Passed: Status surrender correctly recognized and categorized as DE-ESCALATING.');

  // TEST 6: Insufficient Evidence Handling
  console.log('\nTest 6: Insufficient Evidence Handling (<15 chars)');
  const briefRun = await runA01SeductionAnalyst({
    interaction: "hey",
    context: "Intro"
  });
  assert(briefRun.output.overallTrajectory === 'INDETERMINATE', 'Single word / brief fragment must yield INDETERMINATE');
  assert(briefRun.output.confidence <= 30, 'Confidence must be appropriately depressed for short fragments');
  assert(briefRun.output.observations.some(o => o.epistemicStatus === 'anecdotal_observation'), 'Short inputs must be marked anecdotal_observation');
  console.log('✓ Test 6 Passed: Insufficient evidence gracefully handled with INDETERMINATE ruling.');

  // TEST 7: Memory Fallback and Persistence Truthfulness
  console.log('\nTest 7: Memory Fallback Persistence Truthfulness');
  const testRunToPersist: AgentRun<A01Input, A01Output> = {
    id: `a01_test_persist_${Date.now()}`,
    agentId: 'A01',
    agentVersion: '1.0.0',
    input: { interaction: 'Test interaction' },
    output: banterRun.output,
    provenance: banterRun.provenance,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  };

  const memoryPersisted = await saveAgentRun(testRunToPersist, null);
  assert(memoryPersisted.persistenceStatus === 'MEMORY_FALLBACK', 'When DB is unavailable, persistenceStatus MUST be MEMORY_FALLBACK');
  
  const retrieved = await getAgentRunById(testRunToPersist.id, null);
  assert(retrieved !== null, 'In-memory fallback must allow immediate retrieval');
  assert(retrieved?.persistenceStatus === 'MEMORY_FALLBACK', 'Retrieved memory run must report MEMORY_FALLBACK');
  console.log('✓ Test 7 Passed: Memory fallback truthfulness verified (persistenceStatus = MEMORY_FALLBACK).');

  console.log('\n======================================================');
  console.log('ALL A01 SEDUCTION ANALYST TESTS PASSED SUCCESSFULLY! (7/7)');
  console.log('======================================================\n');
}

runA01Tests().catch((err) => {
  console.error('\n❌ A01 TEST SUITE FAILED:', err);
  process.exit(1);
});
