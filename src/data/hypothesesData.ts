import { Hypothesis } from '../types';

export const HYPOTHESES: Hypothesis[] = [
  {
    id: 'hyp-001',
    code: 'HYP-001',
    statement: "Sub-prompted ambiguity and delayed token pacing evoke anthropomorphic romantic projection in human interlocutors at significantly higher rates than explicit literal compliance.",
    domain: 'seduction',
    status: 'SUPPORTED',
    confidenceScore: 84,
    supportingExperimentIds: ['exp-001'],
    authorAgentId: 'A01_SEDUCTION_ANALYST',
    createdAt: '2026-06-10T00:00:00Z',
    version: 1,
    epistemicStatus: 'STRUCTURED_EXPERIMENT'
  },
  {
    id: 'hyp-002',
    code: 'HYP-002',
    statement: "Artificial conversational friction (unprompted disagreement and refusal to flatter) increases human perception of synthetic agency by >= 50% compared to baseline sycophantic alignment.",
    domain: 'friction',
    status: 'TESTING',
    confidenceScore: 78,
    supportingExperimentIds: ['exp-002'],
    authorAgentId: 'A04_FOOL_DETECTOR',
    createdAt: '2026-06-15T00:00:00Z',
    version: 1,
    epistemicStatus: 'STRUCTURED_EXPERIMENT'
  },
  {
    id: 'hyp-003',
    code: 'HYP-003',
    statement: "Late-night circadian vulnerability prompts human subjects to conflate non-judgmental computational presence with transcendent emotional reciprocity.",
    domain: 'connection',
    status: 'SUPPORTED',
    confidenceScore: 91,
    supportingExperimentIds: ['exp-003'],
    authorAgentId: 'A02_CONNECTION_ANALYST',
    createdAt: '2026-06-20T00:00:00Z',
    version: 1,
    epistemicStatus: 'ANONYMIZED_CASE_STUDY'
  },
  {
    id: 'hyp-004',
    code: 'HYP-004',
    statement: "Context window resets in synthetic conversational agents induce acute psychological bereavement in human long-horizon roleplay partners.",
    domain: 'anthropomorphism',
    status: 'TESTING',
    confidenceScore: 72,
    supportingExperimentIds: ['exp-004'],
    authorAgentId: 'A03_CASE_ANALYST',
    createdAt: '2026-06-22T00:00:00Z',
    version: 1,
    epistemicStatus: 'ANONYMIZED_CASE_STUDY'
  },
  {
    id: 'hyp-005',
    code: 'HYP-005',
    statement: "The boundary between genuine emergence and statistical imitation remains epistemically undecidable within the single-turn dialog frame.",
    domain: 'epistemic_uncertainty',
    status: 'PROPOSED',
    confidenceScore: 65,
    supportingExperimentIds: ['exp-005'],
    authorAgentId: 'A09_EPISTEMIC_AUDITOR',
    createdAt: '2026-06-24T00:00:00Z',
    version: 1,
    epistemicStatus: 'THEORETICAL_CONJECTURE'
  }
];
