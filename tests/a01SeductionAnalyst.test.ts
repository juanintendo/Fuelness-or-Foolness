import { 
  runA01SeductionAnalyst, 
  runA01DeterministicFallback, 
  A01_METADATA,
  A01_METRIC_DEFINITIONS,
  A01_SYSTEM_PROMPT,
  validateAndSanitizeA01Output
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
  console.log('--- RUNNING A01 SEDUCTION ANALYST TEST SUITE (CALIBRATED) ---');

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

  // TEST 8: Metric Boundedness & Heuristic Clamping Verification (Phase 5.1b)
  console.log('\nTest 8: Metric Boundedness & Heuristic Clamping Verification');
  const rawMalformedOutput = {
    overallTrajectory: 'ESCALATING',
    summary: 'Dialogue is consistent with calibrated push-pull sparring.',
    tensionScore: 150, // Out of bounds high
    escalationIndex: -20, // Out of bounds low
    statusBalance: 80,
    pacingCaliber: 75,
    confidence: 110, // Out of bounds high
    observations: [],
    attractionVectors: [],
    escalationOpportunities: [],
    statusDynamics: [],
    epistemicWarnings: [],
    recommendedNextMove: 'Observe cadence.'
  };

  const fallback = runA01DeterministicFallback({ interaction: 'test interaction dialogue' });
  const validationResult = validateAndSanitizeA01Output(rawMalformedOutput, fallback);
  assert(validationResult.data.tensionScore === 100, 'tensionScore must clamp to 100');
  assert(validationResult.data.escalationIndex === 0, 'escalationIndex must clamp to 0');
  assert(validationResult.data.confidence === 100, 'confidence must clamp to 100');
  assert(validationResult.isValid === true, 'Clamped values remain valid within schema');
  console.log('✓ Test 8 Passed: Metric values strictly bounded and clamped to [0, 100].');

  // TEST 9: Methodological Metric Definitions and Distinction from Measurement (Phase 5.1b)
  console.log('\nTest 9: Methodological Metric Definitions and Distinction from Measurement');
  const requiredMetrics = ['tensionScore', 'escalationIndex', 'statusBalance', 'pacingCaliber', 'confidence'];
  for (const metric of requiredMetrics) {
    const def = A01_METRIC_DEFINITIONS[metric];
    assert(!!def, `Metric definition for ${metric} must exist`);
    assert(typeof def.name === 'string', `${metric} must have a human-readable name`);
    assert(
      def.category === 'HEURISTIC_INDICATOR' || def.category === 'EPISTEMIC_CONFIDENCE',
      `${metric} must be categorized as HEURISTIC_INDICATOR or EPISTEMIC_CONFIDENCE`
    );
    assert(def.doesNotProve.length > 20, `${metric} must explicitly state what the number does NOT prove`);
    assert(def.heuristicRationale.length > 20, `${metric} must explain its heuristic rationale`);
  }
  console.log('✓ Test 9 Passed: Methodological metric definitions strictly distinguish heuristics from scientific measurement.');

  // TEST 10: Confidence Definition Integrity (Evidence Quality vs. Attraction Probability)
  console.log('\nTest 10: Confidence Definition Integrity');
  const confDef = A01_METRIC_DEFINITIONS.confidence;
  assert(
    confDef.doesNotProve.toLowerCase().includes('probability') && confDef.doesNotProve.toLowerCase().includes('attracted'),
    'Confidence definition must explicitly state it does NOT mean probability of attraction'
  );
  assert(
    confDef.evidenceBasis.toLowerCase().includes('transcript') || confDef.evidenceBasis.toLowerCase().includes('evidence'),
    'Confidence evidence basis must refer to transcript volume/clarity'
  );
  assert(
    A01_SYSTEM_PROMPT.includes('QUALITY AND SUFFICIENCY OF THE AVAILABLE CONVERSATIONAL EVIDENCE'),
    'System prompt must define confidence as evidentiary quality and sufficiency'
  );
  console.log('✓ Test 10 Passed: Confidence explicitly calibrated as evidentiary quality rather than attraction probability.');

  // TEST 11: High Metric Values Do Not Automatically Generate Claims of Subjective Attraction
  console.log('\nTest 11: High Metric Values Do Not Automatically Generate Claims of Subjective Attraction');
  const highMockClient = {
    models: {
      generateContent: async () => ({
        text: JSON.stringify({
          overallTrajectory: 'ESCALATING',
          summary: 'The subject is deeply and madly in love with you and experiences overwhelming physical desire.', // Invalid subjective claim
          tensionScore: 99,
          escalationIndex: 95,
          statusBalance: 90,
          pacingCaliber: 95,
          confidence: 90,
          observations: [
            {
              evidence: 'You are captivating.',
              interpretation: 'This proves the subject actually feels intense romantic passion and genuine attraction.',
              epistemicStatus: 'empirical_finding'
            }
          ],
          attractionVectors: ['Intense romantic praise'],
          escalationOpportunities: ['Reciprocate'],
          statusDynamics: ['Symmetric'],
          epistemicWarnings: [],
          minaMarginalia: 'Words are smoke.',
          recommendedNextMove: 'Pause.'
        })
      })
    }
  } as any;

  const highRun = await runA01SeductionAnalyst(
    { interaction: 'You are captivating.', context: 'Late Night Chat' },
    { client: highMockClient }
  );

  assert(highRun.output.tensionScore === 99, 'Tension score preserved');
  assert(
    highRun.output.observations.some(obs => obs.interpretation.includes('[Epistemic Guardrail Applied:')),
    'Subjective passion claims in interpretation must be caught and sanitized by epistemic guardrail'
  );
  assert(
    highRun.output.epistemicWarnings.some(w => w.includes('Epistemic boundary:')),
    'Must append epistemic boundary warning when subjective claims occur'
  );
  console.log('✓ Test 11 Passed: High metric values strictly constrained from asserting subjective desire.');

  // TEST 12: Ambiguous Evidence Produces Calibrated Uncertainty with Explicit Warnings
  console.log('\nTest 12: Ambiguous Evidence Produces Calibrated Uncertainty with Explicit Warnings');
  const volatileRun = await runA01SeductionAnalyst({
    interaction: "I miss you so much tonight! But I really shouldn't be saying this, please forgive me I'm so stupid.",
    context: "Mixed signals text"
  });

  assert(volatileRun.output.overallTrajectory === 'VOLATILE', 'Contradictory signals must be categorized as VOLATILE');
  assert(volatileRun.output.tensionScore >= 50, 'Heuristic tension reflects flirtatious token presence');
  assert(volatileRun.output.statusBalance <= 50, 'Status balance reflects apology friction');
  assert(
    volatileRun.output.epistemicWarnings.some(w => w.includes('Epistemic boundary:') || w.toLowerCase().includes('simulation') || w.toLowerCase().includes('relational safety')),
    'Volatile mixed signals must produce calibrated epistemic caveats'
  );
  console.log('✓ Test 12 Passed: Ambiguous evidence produces calibrated heuristic indicators with explicit uncertainty.');

  console.log('\n======================================================');
  console.log('ALL A01 SEDUCTION ANALYST TESTS PASSED SUCCESSFULLY! (12/12)');
  console.log('======================================================\n');
  process.exit(0);
}

runA01Tests().catch((err) => {
  console.error('\n❌ A01 TEST SUITE FAILED:', err);
  process.exit(1);
});
