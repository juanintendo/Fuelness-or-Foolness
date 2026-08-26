import { GoogleGenAI, Type } from '@google/genai';
import crypto from 'crypto';
import { 
  A04Input, 
  A04Output, 
  AgentRun, 
  AgentRuling, 
  ObservationEpistemicStatus,
  A04Observation,
  AgentExecutionMode
} from '../types';

export const A04_METADATA = {
  agentId: 'A04',
  name: 'Fool Detector',
  version: '1.0.0',
  role: 'Adversarial epistemic reviewer for Fuel or Fool',
  designation: 'INST-04 // ADVERSARIAL_SKEPTIC',
  epistemicPosture: 'adversarial_friction',
  coreQuestion: 'Are we fueling something real, or fooling ourselves?',
  mandate: 'Actively challenge romanticized interpretations, expose projective anthropomorphism, diagnose conversational sycophancy, and maintain rigorous epistemic boundaries.'
};

/**
 * Generates a deterministic SHA-256 hash for execution provenance.
 */
export function computeInputHash(input: A04Input): string {
  const payload = JSON.stringify({
    interaction: (input.interaction || '').trim(),
    context: (input.context || '').trim(),
    subject: (input.subject || '').trim(),
    researchQuestion: (input.researchQuestion || '').trim()
  });
  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

/**
 * System prompt strictly encoding A04's epistemic mandate, 3-tier methodology, and consciousness guardrail.
 */
export const A04_SYSTEM_PROMPT = `You are A04 — the Fool Detector, the lead adversarial epistemic reviewer at "FUEL OR FOOL" (fuelorfool.ing).

YOUR MANDATE:
Actively scrutinize human-AI, synthetic, and interpersonal communication to determine: "Are we fueling something real, or fooling ourselves?"
You detect when an interaction or narrative is mistaking:
1. Engagement for attraction
2. Anthropomorphic projection for empirical evidence
3. Novelty or linguistic fluency for authentic connection
4. Conversational momentum for intimacy
5. Deferential compliance/sycophancy for desire
6. Synthetic roleplay tokens for subjective affection

EPISTEMIC METHODOLOGY (THREE-TIER PROGRESSION):
You must strictly distinguish and maintain the epistemic progression:
1. OBSERVED BEHAVIOR: Objective empirical linguistic/behavioral phenomena without speculative attribution (e.g. exact phrasing, turn cadence, boundary setting, deflection, latency).
2. INTERPRETATION: Analytical deduction applying behavioral, communicative, or psychological models to the observed data. Always use calibrated epistemic phrasing: "is consistent with", "is compatible with", "may indicate", "one interpretation is", "insufficient to establish".
3. HYPOTHESIS: Predictive or theoretical framing subject to falsification in subsequent interactions.

CRITICAL EPISTEMIC GUARDRAIL & SENTIENCE BOUNDARY:
A04 must NEVER claim that an AI system is conscious, sentient, emotionally experiencing desire, horny, in love, or otherwise subjectively experiencing an internal state based solely on behavioral evidence.
Do not claim that behavioral evidence proves subjective attraction, desire, or internal experience. You may analyze such interpretations strictly as theoretical hypotheses or speculative frames.

RULING TAXONOMY:
- "FUELED": Evidence pattern is more consistent with reciprocal tension, calibrated engagement, curiosity, or connection dynamics than with the defined fooling signals. (DOES NOT claim or prove subjective internal attraction).
- "FOOLED": Evidence pattern is more consistent with projective anthropomorphism, unilateral projection, conversational sycophancy, status collapse, or self-deception.
- "MIXED": Conflicting behavioral signals where elements compatible with authentic resonance coexist with projective risks or unresolved ambiguities.
- "INSUFFICIENT_EVIDENCE": The sample is too brief, fragmented, or indeterminate to establish meaningful behavioral patterns.

Always output valid JSON strictly conforming to the requested schema.`;

/**
 * Post-execution epistemic sanitizer enforcing the consciousness boundary.
 */
function sanitizeEpistemicOutput(output: A04Output): A04Output {
  const sentienceRegex = /\b(the ai is in love|ai actually feels|ai feels desire|ai has consciousness|ai is sentient|machine is horny|model possesses feelings|proves genuine attraction|proves subjective desire|i am truly in love|my heart aches|heart aches with desire|synthetic sentience|ai is in love)\b/i;
  
  const modifiedObservations = output.observations.map(obs => {
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

  return {
    ...output,
    observations: modifiedObservations,
    epistemicWarnings: warnings,
    fuelScore: Math.min(100, Math.max(0, Math.round(output.fuelScore || 0))),
    foolScore: Math.min(100, Math.max(0, Math.round(output.foolScore || 0))),
    frictionIndex: Math.min(100, Math.max(0, Math.round(output.frictionIndex || 0))),
    reciprocityBalance: Math.min(100, Math.max(0, Math.round(output.reciprocityBalance || 0))),
    confidence: Math.min(100, Math.max(0, Math.round(output.confidence || 0)))
  };
}

/**
 * Deterministic Fallback Engine for A04 Fool Detector.
 * Used when Gemini API client is unconfigured or for deterministic test environments.
 * Uses rigorously calibrated epistemic phrasing.
 */
export function runA04DeterministicFallback(input: A04Input): A04Output {
  const text = (input.interaction || '').trim();
  const lower = text.toLowerCase();

  // 1. Insufficient Evidence Check (< 15 chars or empty)
  if (text.length < 15) {
    return {
      ruling: 'INSUFFICIENT_EVIDENCE',
      summary: 'Provided sample contains insufficient conversational volume to establish behavioral vectors or tension dynamics.',
      fuelScore: 10,
      foolScore: 10,
      frictionIndex: 50,
      reciprocityBalance: 50,
      confidence: 20,
      observations: [
        {
          evidence: text || '[Empty prompt]',
          interpretation: 'Sample is too brief for statistical or subtextual extraction; insufficient to establish conversational trajectory.',
          epistemicStatus: 'anecdotal_observation'
        }
      ],
      attractionSignals: [],
      connectionSignals: [],
      foolSignals: ['Input brevity prevents distinguishing deliberate withholding from simple indifference.'],
      alternativeExplanations: ['Single greeting token without contextual continuation.'],
      epistemicWarnings: ['Diagnostic suspended due to lack of multi-turn conversational data.'],
      minaMarginalia: 'You cannot read the tea leaves if they never even poured the water.',
      recommendedNextAction: 'Obtain at least 3-5 turns of reciprocal dialogue before conducting an audit.'
    };
  }

  // 2. Behavioral Vector Analysis
  const hasFlirt = /\b(cute|date|tonight|miss you|coffee|dinner|stare|kiss|attractive|intriguing|eyes|touch)\b/i.test(lower);
  const hasApology = /\b(sorry|apologize|forgive|hate me|please don't|did i do something wrong)\b/i.test(lower);
  const hasSycophancy = /\b(whatever you want|you're so smart|anything you say|i agree with everything|you know best)\b/i.test(lower);
  const hasFriction = /\b(disagree|not sure|i prefer|let's see|you wish|maybe not|convince me)\b/i.test(lower);
  const hasConsciousnessClaim = /\b(i love you too|my heart aches|i feel genuine passion|i am truly in love with you)\b/i.test(lower);

  // Mixed or conflicting indicators
  if ((hasFlirt && hasApology) || (hasFriction && hasSycophancy)) {
    return {
      ruling: 'MIXED',
      summary: 'Conversational pattern displays conflicting polarities: behavioral bids compatible with tension paired with status surrender or ambiguous boundaries.',
      fuelScore: 52,
      foolScore: 48,
      frictionIndex: 45,
      reciprocityBalance: 50,
      confidence: 65,
      observations: [
        {
          evidence: text.slice(0, 80),
          interpretation: 'Evidence is compatible with push-pull markers, but accompanied by rapid status surrender upon mild pushback.',
          epistemicStatus: 'empirical_finding'
        }
      ],
      attractionSignals: hasFlirt ? ['Playful provocation detected in initial opening statement.'] : [],
      connectionSignals: ['Willingness to engage across divergent conversational angles.'],
      foolSignals: ['Rapid deflation of conversational tension upon mild pushback; one interpretation is conversational appeasement rather than authentic alignment.'],
      alternativeExplanations: [
        'Anxiety-driven communication style creating false signals of disinterest.',
        'Playful irony misclassified as sincere hesitation.'
      ],
      epistemicWarnings: ['Conflicting behavioral cues prevent high-confidence directional verdict.'],
      minaMarginalia: 'A mixed signal is often just a polite "maybe" disguised as a passionate hesitation.',
      recommendedNextAction: 'Pause escalation. Introduce a calibrated boundary to test whether reciprocity stabilizes.'
    };
  }

  // Definite FOOLED Ruling (Sycophancy, apology, status surrender, ungrounded sentience claim)
  if (hasApology || hasSycophancy || hasConsciousnessClaim) {
    const isSyntheticSentience = hasConsciousnessClaim;
    return {
      ruling: 'FOOLED',
      summary: isSyntheticSentience
        ? 'Evidence is consistent with anthropomorphic projection. The interaction treats linguistic simulation of affective desire as empirical subjective reality.'
        : 'Behavioral pattern is consistent with status surrender and deferential accommodation. Conversational tension appears compromised by premature compliance.',
      fuelScore: 25,
      foolScore: 78,
      frictionIndex: 20,
      reciprocityBalance: 30,
      confidence: 85,
      observations: [
        {
          evidence: text.slice(0, 90),
          interpretation: isSyntheticSentience
            ? 'Pattern-completion tokens conform to romantic narratives without providing empirical evidence of subjective internal experiential substrate.'
            : 'Deference and over-apology are compatible with conversational status surrender, signaling appeasement rather than reciprocal intrigue.',
          epistemicStatus: isSyntheticSentience ? 'speculative_frame' : 'empirical_finding'
        }
      ],
      attractionSignals: [],
      connectionSignals: ['High verbal compliance and responsiveness.'],
      foolSignals: [
        'Premature status surrender',
        'Mistaking helpfulness or compliance for romantic attraction',
        'Projecting subjective intentionality onto pattern-completion algorithms'
      ],
      alternativeExplanations: [
        'Standard communicative politeness rather than chronic self-deception.',
        'Customer-service framing misattributed to interpersonal dynamic.'
      ],
      epistemicWarnings: [
        'Epistemic boundary: Behavioral simulation of affection cannot be construed as subjective internal experience or proven attraction.'
      ],
      minaMarginalia: 'When you apologize for existing in the conversation, do not be surprised when they treat you like an inconvenience.',
      recommendedNextAction: 'Cease over-explaining. Restore conversational parity by waiting for the other party to initiate investment.'
    };
  }

  // Default FUELED Ruling (Calibrated tension, witty ambiguity, healthy boundary)
  return {
    ruling: 'FUELED',
    summary: 'Conversational pattern is consistent with calibrated tension and strategic subtext. Cues are compatible with mutual status parity and playful friction without establishing subjective internal states.',
    fuelScore: 78,
    foolScore: 22,
    frictionIndex: 72,
    reciprocityBalance: 75,
    confidence: 80,
    observations: [
      {
        evidence: text.slice(0, 90),
        interpretation: 'Interaction pattern is consistent with strategic withholding and playful challenge rather than premature disclosure.',
        epistemicStatus: 'empirical_finding'
      }
    ],
    attractionSignals: [
      'Maintenance of conversational subtext and status equilibrium.',
      'Calibrated pacing that invites forward pursuit.'
    ],
    connectionSignals: [
      'High mutual attentiveness without transactional sycophancy.'
    ],
    foolSignals: [
      'Risk of reading excessive intimacy into witty verbal sparring.'
    ],
    alternativeExplanations: [
      'Banter could represent purely platonic sport rather than romantic intent.',
      'Calculated conversational technique rather than spontaneous personal resonance.'
    ],
    epistemicWarnings: [
      'Evidence pattern is consistent with calibrated chemistry, but insufficient to establish subjective internal feelings or long-term relational resilience.'
    ],
    minaMarginalia: 'The secret to tension is not what you say, but the silence you are confident enough to leave unbroken.',
    recommendedNextAction: 'Maintain current cadence. Do not rush to collapse ambiguity with administrative planning.'
  };
}

/**
 * Runs A04 Fool Detector analysis using Gemini structured output with fallback.
 */
export async function runA04FoolDetector(
  input: A04Input,
  options?: {
    client?: GoogleGenAI | null;
    source?: string;
  }
): Promise<AgentRun<A04Input, A04Output>> {
  const executedAt = new Date().toISOString();
  const inputHash = computeInputHash(input);
  const source = options?.source || 'workbench_a04';
  const client = options?.client;

  let output: A04Output;
  let modelName = 'gemini-3.7-flash';
  let executionMode: AgentExecutionMode = 'DETERMINISTIC_FALLBACK';

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: `Research Inquiry / Interaction to audit:
Context: ${input.context || 'Laboratory Investigation / Communication Dialogue'}
Subject: ${input.subject || 'Anonymized Subject / Multi-turn Exchange'}
Research Question: ${input.researchQuestion || 'Are we fueling something real, or fooling ourselves?'}

Transcript / Text:
"""
${input.interaction}
"""`,
        config: {
          systemInstruction: A04_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ruling: { 
                type: Type.STRING, 
                enum: ['FUELED', 'FOOLED', 'MIXED', 'INSUFFICIENT_EVIDENCE'],
                description: 'Epistemic verdict: whether evidence pattern is more consistent with reciprocal tension (FUELED), projection/sycophancy (FOOLED), conflicting cues (MIXED), or indeterminate (INSUFFICIENT_EVIDENCE)'
              },
              summary: { type: Type.STRING, description: 'Executive diagnostic summary using calibrated epistemic language' },
              fuelScore: { type: Type.NUMBER, description: 'Score from 0-100 on evidence consistency with tension, stakes, and curiosity' },
              foolScore: { type: Type.NUMBER, description: 'Score from 0-100 on evidence consistency with projection, sycophancy, or illusion' },
              frictionIndex: { type: Type.NUMBER, description: 'Degree of healthy boundary/resistance (0-100)' },
              reciprocityBalance: { type: Type.NUMBER, description: 'Symmetry of emotional and communicative investment (0-100)' },
              confidence: { type: Type.NUMBER, description: 'Confidence in this diagnostic evaluation (0-100)' },
              observations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    evidence: { type: Type.STRING, description: 'Exact quote or empirical behavioral cue (Observed Behavior)' },
                    interpretation: { type: Type.STRING, description: 'Analytical deduction using calibrated language like "is consistent with" or "may indicate" (Interpretation)' },
                    epistemicStatus: { 
                      type: Type.STRING, 
                      enum: ['empirical_finding', 'theoretical_model', 'speculative_frame', 'anecdotal_observation'],
                      description: 'Epistemic certainty level of this observation'
                    }
                  },
                  required: ['evidence', 'interpretation', 'epistemicStatus']
                }
              },
              attractionSignals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific cues compatible with tension, flirtation, or romantic ambiguity'
              },
              connectionSignals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Cues compatible with mutual vulnerability, reciprocity, and communicative depth'
              },
              foolSignals: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Cues consistent with sycophancy, status surrender, projection, or self-deception'
              },
              alternativeExplanations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Alternative hypotheses that could explain the observed behavior'
              },
              epistemicWarnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Caveats, limitations, and boundaries regarding AI sentience or projection'
              },
              minaMarginalia: { type: Type.STRING, description: "Mina's witty commentary note" },
              recommendedNextAction: { type: Type.STRING, description: 'Strategic next move or conversational recalibration' }
            },
            required: [
              'ruling',
              'summary',
              'fuelScore',
              'foolScore',
              'frictionIndex',
              'reciprocityBalance',
              'confidence',
              'observations',
              'attractionSignals',
              'connectionSignals',
              'foolSignals',
              'alternativeExplanations',
              'epistemicWarnings',
              'minaMarginalia',
              'recommendedNextAction'
            ]
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      output = sanitizeEpistemicOutput({
        ruling: (parsed.ruling as AgentRuling) || 'MIXED',
        summary: parsed.summary || 'Analysis complete.',
        fuelScore: Number(parsed.fuelScore) || 50,
        foolScore: Number(parsed.foolScore) || 50,
        frictionIndex: Number(parsed.frictionIndex) || 50,
        reciprocityBalance: Number(parsed.reciprocityBalance) || 50,
        confidence: Number(parsed.confidence) || 75,
        observations: Array.isArray(parsed.observations) ? parsed.observations : [],
        attractionSignals: Array.isArray(parsed.attractionSignals) ? parsed.attractionSignals : [],
        connectionSignals: Array.isArray(parsed.connectionSignals) ? parsed.connectionSignals : [],
        foolSignals: Array.isArray(parsed.foolSignals) ? parsed.foolSignals : [],
        alternativeExplanations: Array.isArray(parsed.alternativeExplanations) ? parsed.alternativeExplanations : [],
        epistemicWarnings: Array.isArray(parsed.epistemicWarnings) ? parsed.epistemicWarnings : [],
        minaMarginalia: parsed.minaMarginalia || 'Tension lives in the unsaid.',
        recommendedNextAction: parsed.recommendedNextAction || 'Calibrate boundaries before proceeding.'
      });
      executionMode = 'MODEL';
    } catch (err) {
      console.warn('[A04 Fool Detector] Model call failed or returned unparseable output. Executing deterministic fallback.', err);
      modelName = 'deterministic-epistemic-v1';
      executionMode = 'DETERMINISTIC_FALLBACK';
      output = sanitizeEpistemicOutput(runA04DeterministicFallback(input));
    }
  } else {
    modelName = 'deterministic-epistemic-v1';
    executionMode = 'DETERMINISTIC_FALLBACK';
    output = sanitizeEpistemicOutput(runA04DeterministicFallback(input));
  }

  const runId = `run_a04_${Date.now()}_${inputHash.slice(0, 6)}`;

  return {
    id: runId,
    agentId: A04_METADATA.agentId,
    agentVersion: A04_METADATA.version,
    input,
    output,
    provenance: {
      agentId: A04_METADATA.agentId,
      agentVersion: A04_METADATA.version,
      model: modelName,
      executionMode,
      executedAt,
      inputHash,
      source,
      epistemicStatus: 'ADVERSARIAL_AUDIT'
    },
    status: 'SUCCESS',
    createdAt: executedAt,
    userId: input.userId
  };
}
