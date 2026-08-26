import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FIELD_NOTES } from '../data/fieldNotesData';
import { EXPERIMENTS } from '../data/experimentsData';
import { INTERACTION_CASES } from '../data/casesData';
import { HYPOTHESES } from '../data/hypothesesData';
import { ARTICLE_CONSULTATIONS } from '../data/articleConsultationsData';
import { FieldNote, Experiment, Autopsy, Hypothesis, ArticleConsultation } from '../types';

export interface SeedOptions {
  overwrite?: boolean;
}

export interface SeedResult {
  success: boolean;
  fieldNotesSeeded: number;
  experimentsSeeded: number;
  casesSeeded: number;
  hypothesesSeeded: number;
  consultationsSeeded: number;
  skipped: number;
  errors: string[];
}

export interface CorpusCounts {
  fieldNotes: number;
  experiments: number;
  cases: number;
  hypotheses: number;
  articleConsultations: number;
}

/**
 * Checks document counts in all persistent research collections in Firestore.
 */
export async function getCorpusCounts(): Promise<CorpusCounts> {
  const counts: CorpusCounts = {
    fieldNotes: 0,
    experiments: 0,
    cases: 0,
    hypotheses: 0,
    articleConsultations: 0,
  };

  try {
    const [fnSnap, expSnap, caseSnap, hypSnap, consultSnap] = await Promise.all([
      getDocs(collection(db, 'fieldNotes')),
      getDocs(collection(db, 'experiments')),
      getDocs(collection(db, 'cases')),
      getDocs(collection(db, 'hypotheses')),
      getDocs(collection(db, 'articleConsultations')),
    ]);

    counts.fieldNotes = fnSnap.size;
    counts.experiments = expSnap.size;
    counts.cases = caseSnap.size;
    counts.hypotheses = hypSnap.size;
    counts.articleConsultations = consultSnap.size;
  } catch (error) {
    console.warn('[Seed] Error inspecting corpus collection counts:', error);
  }

  return counts;
}

/**
 * Explicit, idempotent, non-destructive seed operation that copies the canonical
 * static datasets into Firestore while attaching provenance metadata.
 * 
 * Will NOT overwrite existing documents unless { overwrite: true } is explicitly passed.
 */
export async function seedCorpusToFirestore(options: SeedOptions = { overwrite: false }): Promise<SeedResult> {
  const result: SeedResult = {
    success: true,
    fieldNotesSeeded: 0,
    experimentsSeeded: 0,
    casesSeeded: 0,
    hypothesesSeeded: 0,
    consultationsSeeded: 0,
    skipped: 0,
    errors: [],
  };

  const now = new Date().toISOString();

  // 1. Seed Field Notes
  for (const note of FIELD_NOTES) {
    try {
      const docRef = doc(db, 'fieldNotes', note.id);
      if (!options.overwrite) {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          result.skipped++;
          continue;
        }
      }

      const notePayload: FieldNote = {
        ...note,
        createdAt: note.createdAt || note.publishedAt || now,
        updatedAt: now,
        version: note.version || 1,
        authorAgentId: note.authorAgentId || 'A06_MINA_EDITOR',
        source: 'canonical_content_canon',
        status: note.status || 'PUBLISHED',
      };

      await setDoc(docRef, notePayload);
      result.fieldNotesSeeded++;
    } catch (err) {
      const msg = `Failed seeding Field Note ${note.id}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      result.errors.push(msg);
    }
  }

  // 2. Seed Experiments
  for (const exp of EXPERIMENTS) {
    try {
      const docRef = doc(db, 'experiments', exp.id);
      if (!options.overwrite) {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          result.skipped++;
          continue;
        }
      }

      const expPayload: Experiment = {
        ...exp,
        createdAt: exp.createdAt || exp.publishedAt || now,
        updatedAt: now,
        version: exp.version || 1,
        authorAgentId: exp.authorAgentId || 'A05_EXPERIMENT_DESIGNER',
        source: 'canonical_experiments',
      };

      await setDoc(docRef, expPayload);
      result.experimentsSeeded++;
    } catch (err) {
      const msg = `Failed seeding Experiment ${exp.id}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      result.errors.push(msg);
    }
  }

  // 3. Seed Cases / Interaction Autopsies
  for (const c of INTERACTION_CASES) {
    try {
      const docRef = doc(db, 'cases', c.id);
      if (!options.overwrite) {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          result.skipped++;
          continue;
        }
      }

      const casePayload: Autopsy = {
        ...c,
        createdAt: c.createdAt || c.publishedAt || now,
        updatedAt: now,
        version: c.version || 1,
        authorAgentId: c.authorAgentId || 'A03_CASE_ANALYST',
        source: 'canonical_cases',
      };

      await setDoc(docRef, casePayload);
      result.casesSeeded++;
    } catch (err) {
      const msg = `Failed seeding Case ${c.id}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      result.errors.push(msg);
    }
  }

  // 4. Seed Hypotheses
  for (const hyp of HYPOTHESES) {
    try {
      const docRef = doc(db, 'hypotheses', hyp.id);
      if (!options.overwrite) {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          result.skipped++;
          continue;
        }
      }

      const hypPayload: Hypothesis = {
        ...hyp,
        createdAt: hyp.createdAt || now,
        updatedAt: now,
        version: hyp.version || 1,
      };

      await setDoc(docRef, hypPayload);
      result.hypothesesSeeded++;
    } catch (err) {
      const msg = `Failed seeding Hypothesis ${hyp.id}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      result.errors.push(msg);
    }
  }

  // 5. Seed Initial Article Consultations
  for (const consult of ARTICLE_CONSULTATIONS) {
    try {
      const docRef = doc(db, 'articleConsultations', consult.id);
      if (!options.overwrite) {
        const existing = await getDoc(docRef);
        if (existing.exists()) {
          result.skipped++;
          continue;
        }
      }

      const consultPayload: ArticleConsultation = {
        ...consult,
        createdAt: consult.createdAt || now,
      };

      await setDoc(docRef, consultPayload);
      result.consultationsSeeded++;
    } catch (err) {
      const msg = `Failed seeding Consultation ${consult.id}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(msg);
      result.errors.push(msg);
    }
  }

  if (result.errors.length > 0) {
    result.success = false;
  }

  return result;
}
