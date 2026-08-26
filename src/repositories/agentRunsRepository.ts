import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, limit as firestoreLimit, Firestore } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AgentRun, A04Input, A04Output, AgentPersistenceStatus } from '../types';

const COLLECTION_NAME = 'agentRuns';

// In-memory fallback ring buffer for agent runs
export const inMemoryRuns: AgentRun<A04Input, A04Output>[] = [];

/**
 * Saves a new agent run execution artifact to Firestore (with in-memory fallback).
 * Explicitly marks persistenceStatus as 'FIRESTORE' or 'MEMORY_FALLBACK'.
 */
export async function saveAgentRun(
  run: AgentRun<A04Input, A04Output>, 
  customDb?: Firestore | null
): Promise<AgentRun<A04Input, A04Output>> {
  const targetDb = customDb !== undefined ? customDb : db;
  let finalStatus: AgentPersistenceStatus = 'MEMORY_FALLBACK';

  if (targetDb) {
    try {
      const docRef = doc(targetDb, COLLECTION_NAME, run.id);
      await setDoc(docRef, {
        ...run,
        persistenceStatus: 'FIRESTORE' as AgentPersistenceStatus,
        updatedAt: new Date().toISOString()
      });
      finalStatus = 'FIRESTORE';
    } catch (error) {
      console.warn(`[AgentRunsRepository] Firestore write for run ${run.id} failed. Persisted to in-memory fallback:`, error);
      finalStatus = 'MEMORY_FALLBACK';
    }
  } else {
    console.warn(`[AgentRunsRepository] No Firestore instance provided for run ${run.id}. Persisted to in-memory fallback.`);
    finalStatus = 'MEMORY_FALLBACK';
  }

  const persistedRun: AgentRun<A04Input, A04Output> = {
    ...run,
    persistenceStatus: finalStatus
  };

  // Maintain in-memory ring buffer (up to 50 items)
  const existingIdx = inMemoryRuns.findIndex(r => r.id === run.id);
  if (existingIdx >= 0) {
    inMemoryRuns[existingIdx] = persistedRun;
  } else {
    inMemoryRuns.unshift(persistedRun);
    if (inMemoryRuns.length > 50) {
      inMemoryRuns.pop();
    }
  }

  return persistedRun;
}

/**
 * Retrieves an agent run by ID from Firestore or memory.
 */
export async function getAgentRunById(id: string, customDb?: Firestore | null): Promise<AgentRun<A04Input, A04Output> | null> {
  const targetDb = customDb !== undefined ? customDb : db;
  if (targetDb) {
    try {
      const docRef = doc(targetDb, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as AgentRun<A04Input, A04Output>;
        return { ...data, persistenceStatus: data.persistenceStatus || 'FIRESTORE' };
      }
    } catch (error) {
      console.warn(`[AgentRunsRepository] Firestore fetch for ${id} failed:`, error);
    }
  }

  const memoryRun = inMemoryRuns.find(r => r.id === id);
  return memoryRun ? { ...memoryRun } : null;
}

/**
 * Retrieves the most recent agent runs (optionally filtered by agentId).
 */
export async function getRecentAgentRuns(agentId?: string, count: number = 10, customDb?: Firestore | null): Promise<AgentRun<A04Input, A04Output>[]> {
  const targetDb = customDb !== undefined ? customDb : db;
  if (targetDb) {
    try {
      const colRef = collection(targetDb, COLLECTION_NAME);
      const q = query(colRef, orderBy('createdAt', 'desc'), firestoreLimit(count));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const runs: AgentRun<A04Input, A04Output>[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as AgentRun<A04Input, A04Output>;
          if (!agentId || data.agentId === agentId) {
            runs.push({ ...data, id: docSnap.id, persistenceStatus: data.persistenceStatus || 'FIRESTORE' });
          }
        });
        if (runs.length > 0) return runs;
      }
    } catch (error) {
      console.warn('[AgentRunsRepository] Firestore query returned empty or failed. Using memory buffer:', error);
    }
  }

  const filtered = agentId 
    ? inMemoryRuns.filter(r => r.agentId === agentId)
    : inMemoryRuns;

  return filtered.slice(0, count);
}
