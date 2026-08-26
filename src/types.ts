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
}

// Compatibility alias for legacy imports
export type ResearchAgent = Agent;

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
