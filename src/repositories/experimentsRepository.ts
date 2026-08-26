import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Experiment } from '../types';
import { EXPERIMENTS } from '../data/experimentsData';

const COLLECTION_NAME = 'experiments';

/**
 * Retrieves all controlled experiments, querying Firestore first and falling back to static seed data.
 */
export async function getExperiments(): Promise<Experiment[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('code', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const experiments: Experiment[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Experiment;
        experiments.push({
          ...data,
          id: docSnap.id
        });
      });
      return experiments;
    }
  } catch (error) {
    console.warn('[ExperimentsRepository] Firestore query returned empty or failed. Using static corpus fallback:', error);
  }

  return [...EXPERIMENTS];
}

/**
 * Retrieves a single experiment by its ID or code (e.g. 'EXP-001').
 */
export async function getExperimentById(idOrCode: string): Promise<Experiment | null> {
  try {
    // Attempt direct ID fetch
    const docRef = doc(db, COLLECTION_NAME, idOrCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Experiment;
      return { ...data, id: docSnap.id };
    }

    // Attempt matching by experiment code
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      for (const snap of snapshot.docs) {
        const data = snap.data() as Experiment;
        if (data.code?.toLowerCase() === idOrCode.toLowerCase() || snap.id === idOrCode) {
          return { ...data, id: snap.id };
        }
      }
    }
  } catch (error) {
    console.warn(`[ExperimentsRepository] Firestore fetch for ${idOrCode} failed, falling back:`, error);
  }

  const staticExp = EXPERIMENTS.find(e => e.id === idOrCode || e.code.toLowerCase() === idOrCode.toLowerCase());
  return staticExp ? { ...staticExp } : null;
}
