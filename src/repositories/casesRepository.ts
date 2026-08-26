import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Autopsy } from '../types';
import { INTERACTION_CASES } from '../data/casesData';

const COLLECTION_NAME = 'cases';

/**
 * Retrieves all forensic conversation autopsies, querying Firestore first and falling back to static seed data.
 */
export async function getCases(): Promise<Autopsy[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('code', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const cases: Autopsy[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Autopsy;
        cases.push({
          ...data,
          id: docSnap.id
        });
      });
      return cases;
    }
  } catch (error) {
    console.warn('[CasesRepository] Firestore query returned empty or failed. Using static corpus fallback:', error);
  }

  return [...INTERACTION_CASES];
}

/**
 * Retrieves a single conversation autopsy by its ID or case code (e.g. 'CASE-101').
 */
export async function getCaseById(idOrCode: string): Promise<Autopsy | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, idOrCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Autopsy;
      return { ...data, id: docSnap.id };
    }

    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      for (const snap of snapshot.docs) {
        const data = snap.data() as Autopsy;
        if (data.code?.toLowerCase() === idOrCode.toLowerCase() || snap.id === idOrCode) {
          return { ...data, id: snap.id };
        }
      }
    }
  } catch (error) {
    console.warn(`[CasesRepository] Firestore fetch for ${idOrCode} failed, falling back:`, error);
  }

  const staticCase = INTERACTION_CASES.find(c => c.id === idOrCode || c.code.toLowerCase() === idOrCode.toLowerCase());
  return staticCase ? { ...staticCase } : null;
}
