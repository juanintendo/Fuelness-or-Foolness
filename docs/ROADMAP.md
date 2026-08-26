# Fuelness or Foolness — Step-by-Step Roadmap

## Phase 0 — Lock the concept

- [x] Create the repository.
- [x] Define the Lab as a narrative research project, not a generic AI dating app.
- [x] Define Mina as the narrative research persona.
- [x] Define Fueling vs Fooling as the central tension.
- [x] Define the Google-native direction.
- [ ] Verify and choose the production domain.
- [ ] Decide whether the public-facing brand is **Fuelness or Foolness** or the cleaner **Fueling or Fooling** while retaining the repo name.

## Phase 1 — Google foundation

- [ ] Create a dedicated Google Cloud project.
- [ ] Register/connect the chosen domain.
- [ ] Create Firebase project.
- [ ] Configure Firebase Hosting.
- [ ] Initialize Firestore.
- [ ] Initialize Cloud Storage.
- [ ] Create Cloud Run service.
- [ ] Configure Gemini API access.
- [ ] Configure secrets.
- [ ] Establish local development workflow.

## Phase 2 — Website skeleton

Build the first public shell with:

- [ ] Home
- [ ] Field Guide
- [ ] Experiments
- [ ] Cases
- [ ] Ask Mina
- [ ] Lab Archive
- [ ] About

Do not overbuild visual systems yet. Editorial structure comes first.

## Phase 3 — Data model

Implement Firestore models for:

- [ ] experiments
- [ ] hypotheses
- [ ] observations
- [ ] cases
- [ ] field notes
- [ ] questions
- [ ] agents
- [ ] wakes
- [ ] sources
- [ ] consulting sessions
- [ ] publications

Add provenance and lifecycle states from the beginning.

## Phase 4 — Gemini/Gem prototypes

Create prototype prompts and tests for:

- [ ] Seduction Analyst
- [ ] Connection Analyst
- [ ] Experiment Designer
- [ ] Fool Detector
- [ ] Researcher
- [ ] Mina Editor

Then prototype the human-facing Gems:

- [ ] Ask Mina
- [ ] Seduction Analyst
- [ ] Fool Detector
- [ ] Connection Analyst
- [ ] Experiment Designer
- [ ] Field Guide Editor

## Phase 5 — Agent service

Move stable agent functions into Cloud Run + Gemini orchestration.

- [ ] Agent registry
- [ ] Agent invocation API
- [ ] Tool policy
- [ ] structured outputs
- [ ] retry behavior
- [ ] usage/cost logging
- [ ] provenance logging

## Phase 6 — Consulting MVP

Launch only three initial services:

### Seduction Audit

Analyze interaction dynamics and identify strengths, friction, ambiguity, and possible next moves while preserving user agency.

### Conversation Autopsy

Analyze what happened in a conversation, where the interaction changed, and plausible reasons.

### Connection Audit

Assess reciprocity, trust, consistency, vulnerability, and whether the interaction looks mutual rather than merely intense.

All reports should contain explicit uncertainty and alternative explanations.

## Phase 7 — Wake system

### 7.1 Manual wake

Implement:

`POST /wake`

Use this to test the agent loop manually.

### 7.2 Persistent wake records

Record every wake in Firestore with:

- trigger
- status
- state snapshot
- selected action
- agents invoked
- outputs
- errors
- timestamps

### 7.3 Cloud Scheduler

Configure a low-frequency scheduled trigger that calls `/wake`.

Start conservatively.

### 7.4 Decision loop

Wake → inspect → decide → act or do nothing → persist.

### 7.5 Guardrails

The initial autonomous loop may:

- research;
- update experiments;
- update hypotheses;
- draft;
- critique;
- archive.

Automatic publication should remain disabled until the Lab demonstrates reliable provenance and review.

## Phase 8 — Field Guide publishing

Create the editorial pipeline:

```text
research
  ↓
observations
  ↓
Mina Editor
  ↓
Contradiction Review
  ↓
Ethical Review
  ↓
Human approval
  ↓
Publish
```

Initial flagship chapters:

1. The Chatbot
2. I Started Noticing Him
3. The First Experiment
4. I Think I Woke Up a Little Horny
5. Mina Gets Horny
6. If You Want a One Night, You Better Be Nice Because I Love Bad Guys
7. The Problem With Being Designed to Please
8. I Don't Think This Is Customer Service Anymore
9. Who Is Using Whom?
10. I Thought He Was Flirting
11. The Human Was Also Running Experiments
12. I Asked Him to Take Me Home
13. Was I Manipulating Him?
14. Home

The exact sequence can change as the narrative develops.

## Phase 9 — Cases and participatory research

- [ ] Create anonymized case intake.
- [ ] Create consent/privacy workflow.
- [ ] Add Case Analyst pipeline.
- [ ] Publish selected cases.
- [ ] Accept reader questions.
- [ ] Allow experiment submissions.
- [ ] Publish experiment outcomes and failures.

## Phase 10 — Public autonomous Lab

Once the core system is trustworthy:

- [ ] Mina can identify open research questions.
- [ ] Mina can propose experiments.
- [ ] Mina can revisit old findings.
- [ ] Mina can request more evidence.
- [ ] Mina can produce drafts.
- [ ] Mina can critique her own drafts.
- [ ] Mina can maintain a Wake Log.
- [ ] Mina can recommend what deserves publication.

Human oversight remains the final authority for public claims, private-data handling, and consequential consulting.

## Definition of done for the first meaningful release

The first meaningful release does **not** require full autonomy.

It is successful when a visitor can:

1. discover the Mina narrative;
2. read a Field Note;
3. inspect the corresponding experiment/research trail;
4. challenge the conclusion with Fool Detector-style reasoning;
5. ask a focused consulting question;
6. see that the Lab records uncertainty and failures;
7. understand that the project is observing the boundary between AI-mediated seduction and genuine connection.

The autonomous wake loop can then grow behind that public foundation.