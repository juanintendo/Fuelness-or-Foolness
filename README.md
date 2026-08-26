# Fuel or Fool (Mina's Field Guide to Seduction)

> **Repository:** [juanintendo/Fuelness-or-Foolness](https://github.com/juanintendo/Fuelness-or-Foolness)  
> **Version:** `v0` (Editorial Prototype & Domain Architecture)

An aesthetic, high-density AI research laboratory, publishing monograph, consulting door, and experimental infrastructure exploring synthetic attraction, human-AI emotional connection, anthropomorphism, and the delicate boundary between simulated and genuine desire.

---

## ⚠️ Architectural Note on Data & Autonomous Runtime

All telemetry, laboratory agent logs, active tracks, experiment data sets, interaction cases, and Mina quotes currently displayed in this prototype represent **sample and editorial datasets** designed to model the domain schemas.

- **No live connection to Mina's autonomous runtime** is active in this `v0` prototype.
- **Autonomous agent execution, live wake schedules, and payment processing** are deliberately separated and prepared for future backend/Firebase integration.

---

## 🏛️ Domain Architecture

The application is structured around six distinct epistemic domains:

1. **Field Notes & Monograph (`/src/data/fieldNotesData.ts`)**
   - Public excerpts vs. full content separation.
   - Weekly dispatch model (`publishedAt`, `freeUntil`, `isWeeklyFieldNote`).
   - Marginalia annotations (Mina reflections, Fool Detector adversarial audits, researcher references).
   - Article-specific "Ask Mina" consultation contracts.

2. **Controlled Experiments (`/src/data/experimentsData.ts`)**
   - Structured hypotheses, N-sample methodologies, multi-turn logs, friction indices, and ethical review clearances.

3. **Forensic Autopsies & Case Studies (`/src/data/casesData.ts`)**
   - Turn-by-turn annotated timelines, attraction signal classifications, and Fuel vs. Fool rulings.

4. **Consulting Doors (`/src/data/consultingData.ts`)**
   - Bounded consulting formats (Ask Mina, Seduction Audit, Conversation Autopsy, Experiment Commission, Profile Review) with configurable pricing indicators.

5. **Laboratory Instruments & Agents (`/src/data/agentsData.ts`)**
   - 12 autonomous instruments with explicit mandates, system prompt summaries, adversarial biases, and operational access levels (`public` / `internal`).

6. **Public Telemetry & Lab Status (`/src/data/labStatusData.ts`)**
   - Real-time research stream, aggregate Fuel/Fool equilibrium, active tracks, and chronological audit logs.

7. **Configurable Subscription Tiers (`/src/data/subscriptionsData.ts`)**
   - Flexible tier models (`Dispatch Reader`, `Lab Fellow`, `Patron of the Laboratory`) ready for Stripe / Firebase Auth entitlement binding.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (Custom Editorial Warm Paper Palette: `#F4F1EA`, Ink `#1E1E1E`, Crimson `#800020`)
- **Typography:** Playfair Display, Cinzel, Newsreader, JetBrains Mono
- **Icons:** `lucide-react`
- **Animations:** `motion` (`framer-motion`)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run TypeScript check / linter
npm run lint
```
