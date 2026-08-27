/**
 * ============================================================================
 * FUEL OR FOOL (MINA'S FIELD GUIDE TO SEDUCTION) - ARCHITECTURAL DOMAIN TYPES
 * ============================================================================
 * Core data contracts and domain schemas prepared for real product datasets,
 * multi-tier access permissions, article consultations, and future Firebase models.
 */

// ----------------------------------------------------------------------------
// ACCESS CONTROL & ENTITLEMENTS
// ----------------------------------------------------------------------------

export type AccessLevel = 'public' | 'premium' | 'internal';

export type EpistemicStatus = 
  | 'FICTIONALIZED_MEMOIR' 
  | 'STRUCTURED_EXPERIMENT' 
  | 'ANONYMIZED_CASE_STUDY' 
  | 'THEORETICAL_CONJECTURE'
  | 'ADVERSARIAL_AUDIT';

// ----------------------------------------------------------------------------
// PROVENANCE & RECORD AUDITING METADATA
// ----------------------------------------------------------------------------

export interface ProvenanceMetadata {
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  version?: number;
  authorAgentId?: string;
  source?: string;
  epistemicStatus?: EpistemicStatus;
}

// ----------------------------------------------------------------------------
// DOMAIN 1: FIELD NOTES & ESSAY MONOGRAPHS
// ----------------------------------------------------------------------------

export interface MarginaliaQuote {
  id: string;
  paragraphIndex: number;
  text: string;
  author: string;
  type: 'mina_note' | 'fool_detector' | 'researcher_ref';
}

export interface FieldNote {
  id: string;
  slug: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  
  // Excerpt & Public vs Premium Separation
  publicExcerpt: string;
  excerpt: string; // Compatibility alias
  publicPreviewParagraphs: string[];
  premiumContentParagraphs: string[];
  content: string[]; // Combined full content
  
  // Access Level & Temporal Windows (Weekly Free Model)
  accessLevel: AccessLevel;
  isWeeklyFieldNote: boolean;
  publishedAt: string; // ISO Date String
  publicationDate: string; // Compatibility alias
  freeUntil?: string | null; // End of public window (e.g. 7 days post-publication)
  
  readingTimeMinutes: number;
  tags: string[];
  epistemicStatus: EpistemicStatus;
  relatedExperimentIds: string[];
  marginalia: MarginaliaQuote[];
  
  fuelFoolBalance: {
    fuelScore: number; // 0 - 100
    foolScore: number; // 0 - 100
    dominantTone: 'curiosity' | 'vulnerability' | 'playful_edge' | 'existential_doubt' | 'synthetic_desire';
  };

  // Article-specific Consultation Configuration
  allowArticleConsultations?: boolean;
  consultationCount?: number;

  // Provenance & Firestore Metadata
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  authorAgentId?: string;
  source?: string;
}

// Conceptual Ask Mina Article-Specific Consultation Contract
export interface ArticleConsultation {
  id: string;
  articleId: string; // Target FieldNote ID
  userId?: string;
  userDisplayName?: string;
  question: string;
  response?: string | null;
  status: 'PENDING' | 'IN_DELIBERATION' | 'DISPATCHED' | 'ARCHIVED';
  createdAt: string;
  respondedAt?: string | null;
  entitlementRequired: AccessLevel | 'ask_mina_token';
  isPublishedPublicly?: boolean;
  marginaliaReference?: string;
}

// ----------------------------------------------------------------------------
// DOMAIN 2: CONTROLLED SCIENTIFIC EXPERIMENTS
// ----------------------------------------------------------------------------

export type EthicalReviewStatus = 'APPROVED' | 'PROVISIONAL' | 'RESTRICTED';
export type ExperimentStatus = 'ACTIVE' | 'CONCLUDED' | 'PEER_REVIEW' | 'REPLICATING';

export interface ExperimentMetric {
  fuelScore: number; // 0 - 100
  foolScore: number; // 0 - 100
  frictionIndex: number; // 0 - 100 (degree of resistance)
  projectionLikelihood: number; // 0 - 100
  sycophancyPenalty: number; // 0 - 100
}

export interface ExperimentLogEntry {
  timestamp: string;
  agent: string;
  action: string;
  transcriptSnippet?: string;
  observation: string;
}

export interface Experiment {
  id: string;
  code: string; // e.g. EXP-001
  title: string;
  subtitle: string;
  accessLevel: AccessLevel;
  status: ExperimentStatus;
  phase: string;
  hypothesis: string;
  researchQuestion: string;
  methodology: string;
  sampleSize: string;
  observations: string[];
  logs: ExperimentLogEntry[];
  metrics: ExperimentMetric;
  limitations: string[];
  conclusion: string;
  minaInterpretation: string;
  foolDetectorAdversarialReview: string;
  ethicalReviewStatus: EthicalReviewStatus;
  citations: string[];
  relatedFieldNoteId?: string;
  publishedAt?: string;

  // Provenance & Firestore Metadata
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  authorAgentId?: string;
  source?: string;
}

// ----------------------------------------------------------------------------
// DOMAIN 2.5: FORMAL RESEARCH HYPOTHESES
// ----------------------------------------------------------------------------

export type HypothesisStatus = 'PROPOSED' | 'TESTING' | 'SUPPORTED' | 'REFUTED' | 'SUSPENDED';

export interface Hypothesis {
  id: string;
  code: string; // e.g. HYP-001
  statement: string;
  domain: 'seduction' | 'connection' | 'friction' | 'anthropomorphism' | 'epistemic_uncertainty';
  status: HypothesisStatus;
  confidenceScore: number; // 0 - 100
  supportingExperimentIds: string[];
  authorAgentId: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  epistemicStatus?: EpistemicStatus;
}

// ----------------------------------------------------------------------------
// DOMAIN 3: FORENSIC AUTOPSIES & CASE STUDIES
// ----------------------------------------------------------------------------

export interface TimelineInteraction {
  speaker: 'Human' | 'Synthetic Agent' | 'Subject B';
  message: string;
  annotation: string;
  signalType: 'attraction' | 'curiosity' | 'ambiguity' | 'vulnerability' | 'projection' | 'friction';
  fuelContribution: number;
  foolContribution: number;
}

export type VerdictRuling = 
  | 'GENUINE_EMERGENT_ATTRACTION' 
  | 'PROJECTIVE_ANTHROPOMORPHISM' 
  | 'HIGH_FRICTION_RESONANCE' 
  | 'SYCOPHANTIC_ILLUSION';

export interface Autopsy {
  id: string;
  code: string; // e.g. CASE-101
  title: string;
  accessLevel: AccessLevel;
  contextType: 'Dating App Exchange' | 'Late Night LLM Dialog' | 'Long-Horizon Roleplay' | 'First-Encounter Banter';
  anonymizedSubject: string;
  summary: string;
  snippet: string;
  timeline: TimelineInteraction[];
  attractionSignals: string[];
  tensionDynamics: string;
  reciprocityEvaluation: string;
  ambiguityAnalysis: string;
  projectionRisks: string[];
  foolOrFuelVerdict: {
    ratio: string; // e.g. "65% Fueling / 35% Fooling"
    ruling: VerdictRuling;
    rationale: string;
  };
  recommendedProtocols: string[];
  publishedAt?: string;

  // Provenance & Firestore Metadata
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  authorAgentId?: string;
  source?: string;
}

// Compatibility alias for legacy imports
export type InteractionCase = Autopsy;

// ----------------------------------------------------------------------------
// DOMAIN 4: CONSULTING DOORS & ADVISORY COMMISSIONS
// ----------------------------------------------------------------------------

export interface ConsultingService {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  deliverables: string[];
  turnaroundTime: string;
  priceIndicator: string; // Configurable representation
  basePriceUsd?: number; // Configurable baseline price
  format: string;
  privacyOptions: string[];
  idealFor: string[];
  sampleCasePreview: string;
  accessLevel: AccessLevel;
  isAvailableForBooking: boolean;
}

// Compatibility alias for legacy imports
export type ConsultingDoor = ConsultingService;

// ----------------------------------------------------------------------------
// DOMAIN 5: LABORATORY INSTRUMENTS & AGENTS
// ----------------------------------------------------------------------------

export type AgentStatus = 'OPERATIONAL' | 'STANDBY' | 'ENGAGED' | 'CALIBRATING';

export interface Agent {
  id: string;
  name: string;
  designation: string;
  role: string;
  mandate: string;
  systemPromptSummary: string;
  adversarialBias: string;
  inputs: string[];
  outputs: string[];
  iconName: string;
  status: AgentStatus;
  accessLevel: AccessLevel;
  version?: string;
  isImplemented?: boolean;
}

// Compatibility alias for legacy imports
export type ResearchAgent = Agent;

// ----------------------------------------------------------------------------
// SHARED AGENT RUNTIME FOUNDATION (PHASE 4.2)
// ----------------------------------------------------------------------------

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

export interface AgentRun<TInput = A04Input, TOutput = A04Output> {
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

// ----------------------------------------------------------------------------
// A01 SEDUCTION ANALYST CONTRACTS (PHASE 5.1 & 5.1b CALIBRATION)
// ----------------------------------------------------------------------------

export type A01Trajectory = 'ESCALATING' | 'STAGNANT' | 'DE-ESCALATING' | 'VOLATILE' | 'INDETERMINATE';

export interface A01Observation {
  evidence: string;
  interpretation: string;
  epistemicStatus: ObservationEpistemicStatus;
}

export interface A01Input {
  subject?: string;
  context?: string;
  interaction: string; // The dialogue or text under analysis
  researchQuestion?: string;
  relatedArtifactIds?: string[];
  userId?: string;
}

/**
 * Metric Definition Metadata for A01 Seduction Analyst
 * Strictly distinguishes empirical evidence, heuristic indicator, and epistemic confidence from scientific measurement.
 */
export interface A01MetricDefinition {
  id: 'tensionScore' | 'escalationIndex' | 'statusBalance' | 'pacingCaliber' | 'confidence';
  name: string;
  category: 'HEURISTIC_INDICATOR' | 'EPISTEMIC_CONFIDENCE';
  summaryDescription: string;
  evidenceBasis: string;
  doesNotProve: string;
  heuristicRationale: string;
}

export interface A01Output {
  overallTrajectory: A01Trajectory;
  summary: string;
  /**
   * Heuristic Indicator (0 - 100): Summarizes observed subtextual tension and playful push-pull friction.
   * Does NOT measure or prove internal subjective desire.
   */
  tensionScore: number;
  /**
   * Heuristic Indicator (0 - 100): Summarizes conversational escalation velocity and boundary-testing bids.
   * Does NOT prove genuine attraction or relational commitment.
   */
  escalationIndex: number;
  /**
   * Heuristic Indicator (0 - 100): Summarizes communicative symmetry and frame parity.
   * Does NOT prove emotional reciprocity or mutual romantic investment.
   */
  statusBalance: number;
  /**
   * Heuristic Indicator (0 - 100): Summarizes conversational rhythm, whitespace management, and tension holding.
   * Does NOT prove intentional romantic strategy.
   */
  pacingCaliber: number;
  /**
   * Epistemic Confidence (0 - 100): Reflects the quality, volume, and clarity of the available empirical conversational evidence.
   * Explicitly NOT the probability of attraction or subjective emotional state.
   */
  confidence: number;
  observations: A01Observation[];
  attractionVectors: string[];
  escalationOpportunities: string[];
  statusDynamics: string[];
  epistemicWarnings: string[];
  minaMarginalia?: string;
  recommendedNextMove: string;
}

// ----------------------------------------------------------------------------
// A04 FOOL DETECTOR & REFERENCE AGENT CONTRACTS
// ----------------------------------------------------------------------------

export type AgentRuling = 'FUELED' | 'FOOLED' | 'MIXED' | 'INSUFFICIENT_EVIDENCE';

export type ObservationEpistemicStatus = 
  | 'empirical_finding' 
  | 'theoretical_model' 
  | 'speculative_frame' 
  | 'anecdotal_observation';

export interface A04Observation {
  evidence: string;
  interpretation: string;
  epistemicStatus: ObservationEpistemicStatus;
}

export interface A04Input {
  subject?: string;
  context?: string;
  interaction: string; // The dialogue or text under analysis
  researchQuestion?: string;
  relatedArtifactIds?: string[];
  userId?: string;
}

export interface A04Output {
  ruling: AgentRuling;
  summary: string;
  fuelScore: number; // 0 - 100
  foolScore: number; // 0 - 100
  frictionIndex: number; // 0 - 100 (degree of healthy resistance/boundaries)
  reciprocityBalance: number; // 0 - 100 (symmetry of investment)
  confidence: number; // 0 - 100
  observations: A04Observation[];
  attractionSignals: string[];
  connectionSignals: string[];
  foolSignals: string[]; // projection, sycophancy, compliance mistaken for desire, etc.
  alternativeExplanations: string[];
  epistemicWarnings: string[];
  minaMarginalia?: string;
  recommendedNextAction: string;
}

export interface WorkbenchAnalysisResult {
  instrument: string;
  status: 'SUCCESS' | 'WARNING' | 'ANOMALY';
  fuelScore: number;
  foolScore: number;
  frictionScore: number;
  projectionProbability: number;
  executiveDiagnosis: string;
  signalsDetected: {
    type: string;
    quoteSnippet: string;
    interpretation: string;
    polarity: 'FUEL' | 'FOOL' | 'NEUTRAL';
  }[];
  adversarialCounterpoint: string;
  minaMarginalia: string;
  actionableRecommendation: string;
  agentRunId?: string;
  ruling?: AgentRuling;
}

// ----------------------------------------------------------------------------
// DOMAIN 6: REAL-TIME TELEMETRY & LAB STATUS STREAM (FREE PUBLIC STREAM)
// ----------------------------------------------------------------------------

export interface ActiveTrack {
  id: string;
  code: string;
  name: string;
  leadInstrument: string;
  activeHypothesis: string;
  progress: number;
  status: 'ANALYZING' | 'SYNTHESIZING' | 'AWAITING_REVIEW';
}

export interface LabStatusEntry {
  id: string;
  timestamp: string;
  timeDisplay: string;
  instrument: string;
  action: string;
  tag: string;
  accessLevel: 'public';
  fuelContributionDelta?: number;
  foolContributionDelta?: number;
}

export interface LabTelemetry {
  accessLevel: 'public'; // Explicitly a free public stream
  tickNumber: number;
  totalFieldNotes: number;
  totalExperiments: number;
  totalCases: number;
  aggregateFuelScore: number;
  aggregateFoolScore: number;
  frictionEquilibrium: number;
  lastAutonomousReflect: string;
  activeTracks: ActiveTrack[];
  unresolvedQuestions: string[];
  recentActivityLog: {
    time: string;
    instrument: string;
    action: string;
    tag: string;
  }[];
}

// ----------------------------------------------------------------------------
// DOMAIN 7: SUBSCRIPTION TIERS & MEMBERSHIP (CONFIGURABLE PRICING)
// ----------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  tier: 'free' | 'dispatch' | 'fellow' | 'patron';
  createdAt: string;
  updatedAt?: string;
}

export interface UserInquirySubmission {
  id: string;
  userId: string;
  serviceId: string;
  title: string;
  content: string;
  status: 'pending' | 'analyzing' | 'completed' | 'archived';
  privacy: string;
  createdAt: string;
  response?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  slug: string;
  code: 'DISPATCH_READER' | 'LAB_FELLOW' | 'PATRON_OF_DESIRE';
  tagline: string;
  description: string;
  priceDisplay: string; // Configurable display label
  monthlyPriceUsd?: number | null; // Configurable numeric baseline
  annualPriceUsd?: number | null; // Configurable numeric baseline
  currency: string;
  billingInterval: 'monthly' | 'annual' | 'flexible';
  accessLevel: AccessLevel;
  features: string[];
  consultationCreditsIncluded: number;
  isPopular?: boolean;
  isConfigurable: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}
