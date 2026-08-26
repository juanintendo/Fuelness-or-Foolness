# Fuelness or Foolness — Architecture Notes

## Scope

This document expands the README into an implementation-oriented architecture for the first Google-native release.

## Runtime boundaries

```text
Browser
  │
  ├── Firebase Hosting
  │       └── web app
  │
  └── authenticated/public API calls
          │
          ▼
      Cloud Run
          │
          ├── public content API
          ├── consulting API
          ├── agent orchestration
          ├── /wake endpoint
          └── publishing workflow
                 │
          ┌──────┼──────────────┐
          ▼      ▼              ▼
       Gemini  Firestore     Cloud Storage

Cloud Scheduler
      │
      ▼
   POST /wake
```

## Wake lifecycle

A wake should create a durable event before executing work.

```text
Scheduler/manual trigger
        ↓
create wake record: pending
        ↓
load current lab state
        ↓
load active experiments / questions / drafts
        ↓
agent decides whether action is warranted
        ↓
execute zero or more tools
        ↓
write observations/results
        ↓
optionally create draft
        ↓
review gates
        ↓
mark wake complete
```

### Important properties

- **Idempotent:** a retry must not duplicate experiments or publications.
- **Auditable:** each wake records inputs, chosen action, tools used, output references, and final status.
- **Interruptible:** long-running work should be resumable.
- **Conservative:** early autonomous wakes can research, reflect, update drafts, and propose work without automatically publishing.
- **Observable:** errors and agent decisions should be inspectable.

## State model

### Experiment

```text
id
status: proposed | active | paused | completed | failed
hypothesis
question
method
variables
observations[]
conclusion
confidence
createdAt
updatedAt
```

### Field Note

```text
id
slug
title
draft
status: idea | drafting | review | approved | published | superseded
narrativeSources[]
researchSources[]
experimentRefs[]
caseRefs[]
editorialNotes[]
publishedAt
```

### Wake

```text
id
trigger: scheduler | manual | event
status: pending | running | completed | failed | skipped
startedAt
completedAt
stateSnapshot
selectedAction
agentTraceRef
outputs[]
error
```

## Agent execution pattern

Prefer an orchestrator that invokes specialized capabilities rather than giving one prompt every tool in the system.

Example:

```text
Research question
      ↓
Researcher
      ↓
Experiment Designer
      ↓
Experiment / evidence
      ↓
Fool Detector
      ↓
Connection Analyst / Seduction Analyst
      ↓
Mina Editor
      ↓
Ethical Boundary Reviewer
      ↓
Human approval
      ↓
Publisher
```

The exact sequence should be conditional. The agent can decide which specialist is needed, but the system should enforce which transitions require review.

## Gemini / Gems strategy

### Early phase

Use Gems for fast human-facing prototyping and prompt refinement.

### Stabilization phase

Move repeatable, auditable capabilities into server-side Gemini calls orchestrated by Cloud Run.

### Long-term

Keep Gem experiences as lightweight public research interfaces while Cloud Run provides the durable project-level orchestration and state.

This avoids making the production system dependent on a UI-only agent surface.

## Domain strategy

Candidate names from project ideation:

1. `fuelingorfooling.com`
2. `fuelingorfooling.ai`
3. `minawants.com`
4. `seductionlab.ai`
5. `minasseductionlab.com`

Domain availability must be verified before selection.

## Security and privacy baseline

- Never put model/API secrets in the browser.
- Keep Gemini/API keys and service credentials in managed secret storage.
- Separate public article data from private consulting inputs.
- Do not use real conversations in public cases without explicit authorization and robust anonymization.
- Define retention periods for consulting uploads.
- Log provenance without logging unnecessary sensitive content.
- Add rate limiting before public launch of expensive agent endpoints.

## Publication boundary

The first version should have a human approval gate before a Field Note becomes public.

Autonomy can propose, research, draft, critique, and revise. Publication remains explicitly gated until the Lab has demonstrated trustworthy provenance, correction handling, and safety processes.

## Observability

Track at minimum:

- wake counts;
- skipped wakes;
- agent latency;
- agent errors;
- tool calls;
- model usage/cost;
- experiments created/completed;
- drafts created;
- publications approved/rejected;
- consulting requests;
- safety-review interventions.

## Future trigger model

The initial trigger should be scheduled/manual. The architecture should leave room for future event-driven wakes:

```text
new reader question
new consulting case
experiment threshold reached
new source detected
feedback received
scheduled wake
```

All triggers eventually converge on the same `/wake` lifecycle so agency stays centralized.
