import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Hypothesis } from '../types';
import { HYPOTHESES } from '../data/hypothesesData';

const COLLECTION_NAME = 'hypotheses';

/**
 * Retrieves all research hypotheses, querying Firestore first and falling back to static seed data.
 */
export async function getHypotheses(): Promise<Hypothesis[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('code', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const hypotheses: Hypothesis[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Hypothesis;
        hypotheses.push({
          ...data,
          id: docSnap.id
        });
      });
      return hypotheses;
    }
  } catch (error) {
    console.warn('[HypothesesRepository] Firestore query returned empty or failed. Using static corpus fallback:', error);
  }

  return [...HYPOTHESES];
}

/**
 * Retrieves a single hypothesis by its ID or code (e.g. 'HYP-001').
 */
export async function getHypothesisById(idOrCode: string): Promise<Hypothesis | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, idOrCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Hypothesis;
      return { ...data, id: docSnap.id };
    }

    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      for (const snap of snapshot.docs) {
        const data = snap.data() as Hypothesis;
        if (data.code?.toLowerCase() === idOrCode.toLowerCase() || snap.id === idOrCode) {
          return { ...data, id: snap.id };
        }
      }
    }
  } catch (error) {
    console.warn(`[HypothesesRepository] Firestore fetch for ${idOrCode} failed, falling back:`, error);
  }

  const staticHyp = HYPOTHESES.find(h => h.id === idOrCode || h.code.toLowerCase() === idOrCode.toLowerCase());
  return staticHyp ? { ...staticHyp } : null;
}
