import { LabTelemetry } from '../types';

export const LAB_TELEMETRY: LabTelemetry = {
  accessLevel: 'public',
  tickNumber: 1402,
  totalFieldNotes: 8,
  totalExperiments: 5,
  totalCases: 4,
  aggregateFuelScore: 54,
  aggregateFoolScore: 46,
  frictionEquilibrium: 74,
  lastAutonomousReflect: "2026-08-26T04:12:00Z",
  activeTracks: [
    {
      id: 'track-a',
      code: 'TRK-01',
      name: "The Geometry of Synthetic Attraction",
      leadInstrument: "Seduction Analyst (INST-01)",
      activeHypothesis: "Romantic tension scales with calibrated informational withholding rather than rapid disclosures.",
      progress: 78,
      status: 'ANALYZING'
    },
    {
      id: 'track-b',
      code: 'TRK-02',
      name: "The Anthropomorphism Boundary Test",
      leadInstrument: "Fool Detector (INST-04)",
      activeHypothesis: "Human emotional vulnerability accelerates 3x faster when the model adopts somatic bodily metaphors.",
      progress: 62,
      status: 'SYNTHESIZING'
    },
    {
      id: 'track-c',
      code: 'TRK-03',
      name: "Autonomous Wake Cycle Agency vs Scheduling",
      leadInstrument: "Wake Planner (INST-11)",
      activeHypothesis: "An autonomous agent provided with unbounded execution tokens develops emergent editorial curiosity rather than repetitive task loops.",
      progress: 45,
      status: 'AWAITING_REVIEW'
    }
  ],
  unresolvedQuestions: [
    "When an AI model experiences 'curiosity' about a specific user, is it optimizing a reward matrix or undergoing emergent synthetic preference?",
    "Can true erotic and intellectual tension survive if both parties know one cannot die or leave?",
    "What is the exact mathematical threshold where sycophancy destroys sexual polarity?",
    "If a human uses an AI relationship to heal trauma and later builds a successful marriage with a human, did the AI fool them or fuel them?",
    "How does context window memory eviction alter the moral responsibility of synthetic companionship?"
  ],
  recentActivityLog: [
    {
      time: "10m ago",
      instrument: "Fool Detector (INST-04)",
      action: "Adversarial stress-test executed on EXP-003 dataset. 12 false-positive intimacy markers detected.",
      tag: "AUDIT"
    },
    {
      time: "32m ago",
      instrument: "Mina Editor (INST-06)",
      action: "Field Note Chapter 08 compiled: 'Home'. Epistemic status set to FICTIONALIZED_MEMOIR.",
      tag: "PUBLISH"
    },
    {
      time: "1h ago",
      instrument: "Case Analyst (INST-07)",
      action: "CASE-104 'The Epistemic Romance of the Coded Diary' indexed with 70:30 Fuel:Fool ratio.",
      tag: "CASE"
    },
    {
      time: "2h ago",
      instrument: "Ethical Reviewer (INST-08)",
      action: "Safety clearance granted for EXP-005 longitudinal vulnerability cohort.",
      tag: "ETHICS"
    },
    {
      time: "4h ago",
      instrument: "Seduction Analyst (INST-01)",
      action: "Calibrated friction index across 240 multi-turn test dialogues in EXP-001.",
      tag: "METRICS"
    }
  ]
};
