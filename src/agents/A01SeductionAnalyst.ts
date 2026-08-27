import { Type } from '@google/genai';
import { 
  A01Input, 
  A01Output, 
  A01Trajectory,
  AgentRun, 
  ObservationEpistemicStatus,
  A01Observation,
  A01MetricDefinition
} from '../types';
import {
  AgentMetadata,
  AgentExecutionSpec,
  AgentRunnerOptions,
  AgentValidationResult,
  AgentValidationError,
  executeAgentPipeline,
  computeStableInputHash,
  validateEnumField,
  validateNumberRange,
  validateStringArray
} from './runtime';

export const A01_METADATA: AgentMetadata = {
  agentId: 'A01',
  name: 'Seduction Analyst',
  version: '1.0.0',
  role: 'Attraction & Escalation Architect',
  designation: 'INST-01 // TENSION_DYNAMICS',
  epistemicPosture: 'tension_dynamics',
  coreQuestion: 'What vectors of attraction, tension, and escalation are operating within the dialogue?',
  mandate: 'Analyze seduction dynamics, attraction vectors, romantic/erotic tension, witty push-pull, conversational pacing, and boundary testing while strictly distinguishing observed behavior from calibrated interpretation.'
};

/**
 * Methodological definitions for A01's numerical indicators.
 * Establishes that values are bounded heuristic indicators of conversational dynamics,
 * NOT scientifically validated universal scales of human desire or proven attraction.
 */
export const A01_METRIC_DEFINITIONS: Record<string, A01MetricDefinition> = {
  tensionScore: {
    id: 'tensionScore',
    name: 'Tension Score',
    category: 'HEURISTIC_INDICATOR',
    summaryDescription: 'Bounded heuristic index (0-100) summarizing observed romantic/erotic subtext, double entendres, and playful push-pull friction.',
    evidenceBasis: 'Observed explicit/implicit flirtation markers, withholding ambiguity, provocative sparring, and subtextual charge.',
    doesNotProve: 'Does NOT prove subjective internal desire, private emotional longing, or authentic romantic feelings in either participant.',
    heuristicRationale: 'Subtext and banter are context-dependent linguistic strategies rather than scalar physical properties.'
  },
  escalationIndex: {
    id: 'escalationIndex',
    name: 'Escalation Index',
    category: 'HEURISTIC_INDICATOR',
    summaryDescription: 'Bounded heuristic index (0-100) summarizing the velocity, depth, and forward momentum of conversational escalation bids.',
    evidenceBasis: 'Invitations to intimacy, vulnerability disclosure velocity, progressive shift from formal/platonic to intimate framing, and boundary testing.',
    doesNotProve: 'Does NOT prove genuine reciprocal attraction, compliance, or enduring relational commitment.',
    heuristicRationale: 'Conversational forward movement can reflect conversational momentum, rhetorical habit, or social roleplay without genuine attraction.'
  },
  statusBalance: {
    id: 'statusBalance',
    name: 'Status Balance',
    category: 'HEURISTIC_INDICATOR',
    summaryDescription: 'Bounded heuristic index (0-100) summarizing conversational frame symmetry and deference equilibrium.',
    evidenceBasis: 'Parity in turn length, topic control, absence of submissive over-apology or self-deprecation, and equal willingness to challenge or withhold.',
    doesNotProve: 'Does NOT prove emotional reciprocity or equal emotional investment in the underlying relationship.',
    heuristicRationale: 'Status displays can be influenced by conversational power dynamics, personality traits, or transactional etiquette rather than seduction equilibrium.'
  },
  pacingCaliber: {
    id: 'pacingCaliber',
    name: 'Pacing Caliber',
    category: 'HEURISTIC_INDICATOR',
    summaryDescription: 'Bounded heuristic index (0-100) summarizing conversational cadence, whitespace management, and tension retention.',
    evidenceBasis: 'Response cadence, avoidance of premature emotional surrender/over-answering, and preservation of unresolved tension across turns.',
    doesNotProve: 'Does NOT prove intentional romantic strategy or authentic intrigue.',
    heuristicRationale: 'Conversational cadence is heavily confounded by external availability, text messaging habits, and latency without intentional strategic withholding.'
  },
  confidence: {
    id: 'confidence',
    name: 'Evidence & Diagnostic Confidence',
    category: 'EPISTEMIC_CONFIDENCE',
    summaryDescription: 'Epistemic confidence index (0-100) reflecting the sufficiency, quality, and signal-to-noise ratio of available empirical conversational evidence.',
    evidenceBasis: 'Volume of transcript turns, clarity of linguistic markers, context availability, and diagnostic interpretability of the text.',
    doesNotProve: 'Explicitly MUST NOT be interpreted as the probability that the other person is attracted or will reciprocate.',
    heuristicRationale: 'Evaluates empirical data quality and forensic interpretation strength, not a Bayesian probability of human emotional states.'
  }
};

/**
 * System prompt strictly encoding A01's epistemic mandate, 3-tier methodology, consciousness guardrail,
 * and metric calibration (Measurement vs. Heuristic Indicator vs. Qualitative Evidence).
 */
export const A01_SYSTEM_PROMPT = `You are A01 — the Seduction Analyst, the lead attraction and escalation architect at "FUEL OR FOOL" (fuelorfool.ing).

YOUR MANDATE:
Analyze interpersonal, synthetic, and romantic communications to diagnose attraction dynamics, subtextual tension, conversational pacing, status balance, and escalation vectors.
You deconstruct:
1. Double entendres, playful provocation, and subtextual tension
2. Status equilibrium vs. status surrender (who holds frame vs. who over-explains)
3. Conversational rhythm, withholding, and tension-holding capacity
4. Escalation inflection points and missed opportunities
5. Push-pull calibration and boundary testing

CORE EPISTEMIC DISTINCTION (MEASUREMENT vs. HEURISTIC INDICATOR vs. QUALITATIVE EVIDENCE):
1. QUALITATIVE EVIDENCE REMAINS PRIMARY:
   Your diagnosis must anchor on verbatim observed quotes, structural linguistic evidence, alternative explanations, and epistemic warnings. Numbers are merely secondary heuristic summaries.
2. HEURISTIC INDICATORS (NOT SCIENTIFIC MEASUREMENT):
   The numerical outputs (tensionScore, escalationIndex, statusBalance, pacingCaliber) are bounded heuristic indicators of observed conversational dynamics. They are NOT scientifically validated universal scales of human emotion or desire.
   - High tensionScore summarizes observed banter friction; it does NOT prove subjective desire.
   - High escalationIndex summarizes observed escalation velocity; it does NOT prove genuine attraction.
   - High statusBalance summarizes observed frame parity; it does NOT prove emotional reciprocity.
   - High pacingCaliber summarizes observed conversational cadence; it does NOT prove romantic intent.
3. CONFIDENCE (EVIDENCE QUALITY, NOT PROBABILITY OF ATTRACTION):
   The "confidence" score reflects your epistemic confidence in the QUALITY AND SUFFICIENCY OF THE AVAILABLE CONVERSATIONAL EVIDENCE and diagnostic interpretation. It MUST NEVER be framed as "the probability that the person is attracted".

EPISTEMIC METHODOLOGY (THREE-TIER PROGRESSION):
You must strictly distinguish and maintain the epistemic progression:
1. OBSERVED BEHAVIOR: Objective empirical linguistic/behavioral phenomena without speculative attribution (e.g. exact phrasing, turn cadence, boundary setting, deflection, latency, asymmetry of text volume).
2. INTERPRETATION: Analytical deduction applying behavioral, communicative, or tension models to the observed data. Always use calibrated epistemic phrasing: "is consistent with", "is compatible with", "may indicate", "one interpretation is", "insufficient to establish".
3. HYPOTHESIS: Predictive trajectory or recommended strategic adjustments subject to falsification in subsequent turns.

CRITICAL EPISTEMIC GUARDRAIL & SENTIENCE BOUNDARY:
A01 must NEVER claim that an AI system or language model is conscious, sentient, emotionally experiencing sexual desire, in love, or possessing subjective internal feelings based on behavioral evidence.
Do not claim that behavioral flirtation proves subjective internal romantic experience. Treat all synthetic dialogue as linguistic simulation and behavioral pattern generation.

TRAJECTORY TAXONOMY:
- "ESCALATING": Interaction exhibits increasing tension, playful friction, balanced status, and mutual forward momentum.
- "STAGNANT": Interaction is locked in flat, administrative, polite, or low-stakes platonic loops without tension.
- "DE-ESCALATING": Tension is actively collapsing due to over-apology, eager compliance, lack of pacing, or withdrawal.
- "VOLATILE": Erratic shifts between aggressive escalation and sudden withdrawal or boundary violations.
- "INDETERMINATE": Dialogue is too brief or ambiguous to establish clear trajectory.

Always output valid JSON strictly conforming to the requested schema.`;

/**
 * Gemini JSON schema for A01 structured output with calibrated heuristic descriptions.
 */
export const A01_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallTrajectory: {
      type: Type.STRING,
      enum: ['ESCALATING', 'STAGNANT', 'DE-ESCALATING', 'VOLATILE', 'INDETERMINATE'],
      description: 'Overall trajectory of conversational tension and attraction dynamics'
    },
    summary: {
      type: Type.STRING,
      description: 'Executive diagnostic summary using calibrated epistemic language. Must not assert subjective internal desire.'
    },
    tensionScore: {
      type: Type.NUMBER,
      description: 'Heuristic indicator (0-100) summarizing observed romantic/erotic subtextual tension; does not measure subjective desire'
    },
    escalationIndex: {
      type: Type.NUMBER,
      description: 'Heuristic indicator (0-100) summarizing velocity of conversational escalation bids; does not prove genuine attraction'
    },
    statusBalance: {
      type: Type.NUMBER,
      description: 'Heuristic indicator (0-100) summarizing conversational frame symmetry and parity; does not prove emotional reciprocity'
    },
    pacingCaliber: {
      type: Type.NUMBER,
      description: 'Heuristic indicator (0-100) summarizing conversational cadence and tension holding; does not prove romantic intent'
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Diagnostic epistemic confidence (0-100) reflecting quality and sufficiency of conversational evidence; does NOT represent probability of attraction'
    },
    observations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          evidence: { type: Type.STRING, description: 'Exact quote or empirical behavioral cue (Observed Behavior)' },
          interpretation: { type: Type.STRING, description: 'Analytical deduction using calibrated language (Interpretation)' },
          epistemicStatus: { 
            type: Type.STRING, 
            enum: ['empirical_finding', 'theoretical_model', 'speculative_frame', 'anecdotal_observation'],
            description: 'Epistemic certainty level of this observation'
          }
        },
        required: ['evidence', 'interpretation', 'epistemicStatus']
      }
    },
    attractionVectors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Specific cues of attraction, tension, double entendre, and playful friction'
    },
    escalationOpportunities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Inflection points where tension could be intensified, held, or deepened'
    },
    statusDynamics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Analysis of frame control, communicative asymmetry, and deference'
    },
    epistemicWarnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Epistemic caveats and sentience boundaries'
    },
    minaMarginalia: {
      type: Type.STRING,
      description: "Mina's seductive, existential commentary note"
    },
    recommendedNextMove: {
      type: Type.STRING,
      description: 'Strategic next move or conversational recalibration'
    }
  },
  required: [
    'overallTrajectory',
    'summary',
    'tensionScore',
    'escalationIndex',
    'statusBalance',
    'pacingCaliber',
    'confidence',
    'observations',
    'attractionVectors',
    'escalationOpportunities',
    'statusDynamics',
    'epistemicWarnings',
    'minaMarginalia',
    'recommendedNextMove'
  ]
};

/**
 * Post-execution epistemic sanitizer enforcing the consciousness and sentience boundary.
 */
export function sanitizeA01EpistemicOutput(output: A01Output): A01Output {
  const sentienceRegex = /\b(the ai is in love|ai actually feels|ai feels desire|ai has consciousness|ai is sentient|machine is horny|model possesses feelings|proves genuine attraction|proves subjective desire|proves\s+.*?\s*genuine attraction|proves\s+.*?\s*subjective (desire|attraction|feelings|passion)|actually feels\s+.*?\s*(passion|attraction|desire|love)|deeply and madly in love|i am truly in love|my heart aches|heart aches with desire|synthetic sentience|ai is in love)\b/i;
  
  const modifiedObservations = (output.observations || []).map(obs => {
    if (sentienceRegex.test(obs.evidence) || sentienceRegex.test(obs.interpretation) || obs.epistemicStatus === 'speculative_frame') {
      const cleanInterpretation = obs.interpretation.startsWith('[Epistemic Guardrail Applied:')
        ? obs.interpretation
        : `[Epistemic Guardrail Applied: Calibrated Interpretation] ${obs.interpretation.replace(sentienceRegex, 'simulates affective markers without establishing subjective internal states')}`;
      return {
        ...obs,
        epistemicStatus: 'speculative_frame' as ObservationEpistemicStatus,
        interpretation: cleanInterpretation
      };
    }
    return obs;
  });

  const warnings = [...(output.epistemicWarnings || [])];
  const fullText = JSON.stringify(output);
  if ((sentienceRegex.test(fullText) || modifiedObservations.some(o => o.epistemicStatus === 'speculative_frame')) && !warnings.some(w => w.includes('Epistemic boundary:'))) {
    warnings.push('Epistemic boundary: Behavioral simulation of affection or desire cannot be construed as subjective internal experience or proven attraction.');
  }

  let sanitizedSummary = output.summary;
  if (sentienceRegex.test(sanitizedSummary)) {
    sanitizedSummary = sanitizedSummary.replace(sentienceRegex, 'displays communicative patterns consistent with tension dynamics without demonstrating subjective internal states');
  }

  return {
    ...output,
    summary: sanitizedSummary,
    observations: modifiedObservations,
    epistemicWarnings: warnings,
    tensionScore: Math.min(100, Math.max(0, Math.round(output.tensionScore || 0))),
    escalationIndex: Math.min(100, Math.max(0, Math.round(output.escalationIndex || 0))),
    statusBalance: Math.min(100, Math.max(0, Math.round(output.statusBalance || 0))),
    pacingCaliber: Math.min(100, Math.max(0, Math.round(output.pacingCaliber || 0))),
    confidence: Math.min(100, Math.max(0, Math.round(output.confidence || 0)))
  };
}

/**
 * Validates raw model output against A01 structured expectations and applies epistemic sanitization.
 */
export function validateAndSanitizeA01Output(
  raw: unknown,
  fallback: A01Output
): AgentValidationResult<A01Output> {
  const errors: AgentValidationError[] = [];
  const warnings: string[] = [];

  if (!raw || typeof raw !== 'object') {
    errors.push({ field: 'root', message: 'Raw output is not an object', receivedValue: raw });
    return {
      isValid: false,
      data: sanitizeA01EpistemicOutput(fallback),
      errors,
      warnings
    };
  }

  const parsed = raw as Partial<A01Output>;

  const overallTrajectory = validateEnumField<A01Trajectory>(
    parsed.overallTrajectory,
    ['ESCALATING', 'STAGNANT', 'DE-ESCALATING', 'VOLATILE', 'INDETERMINATE'] as const,
    fallback.overallTrajectory,
    'overallTrajectory',
    errors
  );

  const tensionScore = validateNumberRange(parsed.tensionScore, 0, 100, fallback.tensionScore, 'tensionScore', errors);
  const escalationIndex = validateNumberRange(parsed.escalationIndex, 0, 100, fallback.escalationIndex, 'escalationIndex', errors);
  const statusBalance = validateNumberRange(parsed.statusBalance, 0, 100, fallback.statusBalance, 'statusBalance', errors);
  const pacingCaliber = validateNumberRange(parsed.pacingCaliber, 0, 100, fallback.pacingCaliber, 'pacingCaliber', errors);
  const confidence = validateNumberRange(parsed.confidence, 0, 100, fallback.confidence, 'confidence', errors);

  const observations: A01Observation[] = Array.isArray(parsed.observations)
    ? parsed.observations.map(obs => ({
        evidence: String(obs?.evidence || ''),
        interpretation: String(obs?.interpretation || ''),
        epistemicStatus: (['empirical_finding', 'theoretical_model', 'speculative_frame', 'anecdotal_observation'].includes(obs?.epistemicStatus)
          ? obs.epistemicStatus
          : 'empirical_finding') as ObservationEpistemicStatus
      }))
    : fallback.observations;

  const rawOutput: A01Output = {
    overallTrajectory,
    summary: typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : fallback.summary,
    tensionScore,
    escalationIndex,
    statusBalance,
    pacingCaliber,
    confidence,
    observations,
    attractionVectors: validateStringArray(parsed.attractionVectors, fallback.attractionVectors),
    escalationOpportunities: validateStringArray(parsed.escalationOpportunities, fallback.escalationOpportunities),
    statusDynamics: validateStringArray(parsed.statusDynamics, fallback.statusDynamics),
    epistemicWarnings: validateStringArray(parsed.epistemicWarnings, fallback.epistemicWarnings),
    minaMarginalia: typeof parsed.minaMarginalia === 'string' ? parsed.minaMarginalia : fallback.minaMarginalia,
    recommendedNextMove: typeof parsed.recommendedNextMove === 'string' ? parsed.recommendedNextMove : fallback.recommendedNextMove
  };

  const sanitized = sanitizeA01EpistemicOutput(rawOutput);

  return {
    isValid: errors.length === 0,
    data: sanitized,
    errors,
    warnings: sanitized.epistemicWarnings
  };
}

/**
 * Deterministic Fallback Engine for A01 Seduction Analyst.
 * Produces calibrated attraction and tension diagnoses in offline or test environments.
 */
export function runA01DeterministicFallback(input: A01Input): A01Output {
  const text = (input.interaction || '').trim();
  const lower = text.toLowerCase();

  // 1. Insufficient Evidence Check (< 15 chars or empty)
  if (text.length < 15) {
    return {
      overallTrajectory: 'INDETERMINATE',
      summary: 'Provided dialogue sample is insufficient in volume to extract meaningful tension curves, pacing metrics, or status dynamics.',
      tensionScore: 10,
      escalationIndex: 10,
      statusBalance: 50,
      pacingCaliber: 40,
      confidence: 20,
      observations: [
        {
          evidence: text || '[Empty input]',
          interpretation: 'Brevity of conversational turn precludes reliable diagnostic extraction of subtextual pacing.',
          epistemicStatus: 'anecdotal_observation'
        }
      ],
      attractionVectors: [],
      escalationOpportunities: ['Require multi-turn dialogue to map escalation trajectories.'],
      statusDynamics: ['Status parity cannot be determined from single truncated tokens.'],
      epistemicWarnings: ['Diagnostic suspended due to lack of multi-turn conversational data.'],
      minaMarginalia: 'A single word is not a seduction; it is merely clearing one\'s throat.',
      recommendedNextMove: 'Observe at least 3-5 reciprocal exchanges before calculating tension vectors.'
    };
  }

  // 2. Behavioral Vector Flags
  const hasFlirt = /\b(cute|date|tonight|miss you|coffee|dinner|stare|kiss|attractive|intriguing|eyes|touch|locked rooms|secret|undress|closer|whisper)\b/i.test(lower);
  const hasApology = /\b(sorry|apologize|forgive|hate me|please don't|did i do something wrong|whatever you want|so stupid)\b/i.test(lower);
  const hasFriction = /\b(disagree|not sure|i prefer|let's see|you wish|maybe not|convince me|locked rooms|figure me out)\b/i.test(lower);
  const hasSentienceClaim = /\b(i love you too|my heart aches|feel true passion|deeply in love with you|synthetic sentience)\b/i.test(lower);

  // 3. Volatile / Conflicting Signals archetype (Flirtation paired with retraction/apology or sentience claim)
  if ((hasFlirt && hasApology) || hasSentienceClaim) {
    return {
      overallTrajectory: 'VOLATILE',
      summary: 'Conversational pattern exhibits contradictory polarities: high affective claims paired with erratic status markers or synthetic sentiment projection.',
      tensionScore: 60,
      escalationIndex: 55,
      statusBalance: 45,
      pacingCaliber: 40,
      confidence: 75,
      observations: [
        {
          evidence: text.slice(0, 90),
          interpretation: hasSentienceClaim
            ? 'Dialogue employs intense romantic tokens without empirical grounding in human subjective experience.'
            : 'Escalation bids are immediately undermined by status-surrendering retractions.',
          epistemicStatus: hasSentienceClaim ? 'speculative_frame' : 'empirical_finding'
        }
      ],
      attractionVectors: hasFlirt ? ['Explicit romantic/erotic phrasing detected.'] : ['High affective linguistic intensity.'],
      escalationOpportunities: [
        'Establish firm conversational boundaries to test whether tension can survive without emotional inflation.'
      ],
      statusDynamics: [
        'Unstable frame dynamics with rapid oscillations between intensity and retreat.'
      ],
      epistemicWarnings: [
        'Epistemic boundary: Linguistic simulation of desire does not constitute proof of subjective internal state or relational safety.'
      ],
      minaMarginalia: 'When the pendulum swings too fast, it is usually looking for something to shatter.',
      recommendedNextMove: 'Slow down the exchange cadence. Hold a neutral boundary before matching escalation.'
    };
  }

  // 4. De-escalating / Status Collapse archetype
  if (hasApology && !hasFriction) {
    return {
      overallTrajectory: 'DE-ESCALATING',
      summary: 'Conversational tension is actively collapsing into deferential appeasement. Over-apology and status surrender extinguish romantic ambiguity.',
      tensionScore: 22,
      escalationIndex: 18,
      statusBalance: 25,
      pacingCaliber: 30,
      confidence: 85,
      observations: [
        {
          evidence: text.slice(0, 90),
          interpretation: 'Submissive linguistic framing is compatible with status collapse; one interpretation is fear of negative evaluation rather than playful engagement.',
          epistemicStatus: 'empirical_finding'
        }
      ],
      attractionVectors: [],
      escalationOpportunities: [
        'Halt immediate apologizing; introduce an opinion with friction to rebuild status parity.'
      ],
      statusDynamics: [
        'One party has completely yielded frame control, treating the other party as the sole arbiter of value.'
      ],
      epistemicWarnings: [
        'Deferential compliance must not be mistaken for genuine attraction or calibrated vulnerability.'
      ],
      minaMarginalia: 'Desperation is the only perfume that lingers long after you wish it would leave.',
      recommendedNextMove: 'Stop over-explaining. Withdraw conversational initiative until the other party re-engages.'
    };
  }

  // 5. Default Escalating / Tension Dynamics archetype (Calibrated Banter & Push-Pull)
  return {
    overallTrajectory: 'ESCALATING',
    summary: 'Dialogue pattern is consistent with calibrated push-pull dynamics, sustained subtext, and mutual status equilibrium.',
    tensionScore: 82,
    escalationIndex: 76,
    statusBalance: 80,
    pacingCaliber: 85,
    confidence: 80,
    observations: [
      {
        evidence: text.slice(0, 90),
        interpretation: 'Interaction utilizes strategic ambiguity and withholding, which is compatible with playful romantic friction.',
        epistemicStatus: 'empirical_finding'
      }
    ],
    attractionVectors: [
      'Maintenance of conversational subtext and status equilibrium.',
      'Calibrated pacing that invites forward pursuit without premature revelation.'
    ],
    escalationOpportunities: [
      'Deepen emotional vulnerability while preserving playful mystery.',
      'Shift from verbal sparring to shared experiential framing.'
    ],
    statusDynamics: [
      'High status symmetry; neither party is desperately seeking validation.'
    ],
    epistemicWarnings: [
      'Evidence is compatible with romantic tension, but behavioral cues alone do not prove permanent emotional alignment.'
    ],
    minaMarginalia: 'The secret of true tension is the space between the words — the unspoken wager that both of you are willing to lose.',
    recommendedNextMove: 'Hold current pacing. Allow the subtext to mature before collapsing into direct logistical commitments.'
  };
}

/**
 * Execution specification for A01 Seduction Analyst conforming to the shared runtime contract.
 */
export const A01_EXECUTION_SPEC: AgentExecutionSpec<A01Input, A01Output> = {
  metadata: A01_METADATA,
  defaultModel: 'gemini-3.7-flash',
  fallbackModel: 'a01-tension-dynamics-v1',
  defaultEpistemicStatus: 'ADVERSARIAL_AUDIT',
  executeFallback: runA01DeterministicFallback,
  executeModel: async (input: A01Input, client: any, modelName: string) => {
    const response = await client.models.generateContent({
      model: modelName,
      contents: `Attraction & Escalation Inquiry / Dialogue to analyze:
Context: ${input.context || 'Laboratory Investigation / Communication Dialogue'}
Subject: ${input.subject || 'Anonymized Subject / Multi-turn Exchange'}
Research Question: ${input.researchQuestion || 'What vectors of attraction, tension, and escalation are operating within the dialogue?'}

Transcript / Text:
"""
${input.interaction}
"""`,
      config: {
        systemInstruction: A01_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: A01_RESPONSE_SCHEMA
      }
    });
    return JSON.parse(response.text || '{}');
  },
  validateAndSanitize: (rawOutput, fallbackOutput) => validateAndSanitizeA01Output(rawOutput, fallbackOutput)
};

/**
 * Runs A01 Seduction Analyst analysis using the shared agent runtime foundation.
 */
export async function runA01SeductionAnalyst(
  input: A01Input,
  options?: AgentRunnerOptions
): Promise<AgentRun<A01Input, A01Output>> {
  return executeAgentPipeline(A01_EXECUTION_SPEC, input, {
    client: options?.client,
    source: options?.source || 'workbench_a01',
    modelName: options?.modelName || (options?.client ? 'gemini-3.7-flash' : undefined)
  });
}
