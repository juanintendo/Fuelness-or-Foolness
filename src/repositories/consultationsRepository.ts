import { collection, getDocs, doc, setDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArticleConsultation } from '../types';
import { ARTICLE_CONSULTATIONS } from '../data/articleConsultationsData';

const COLLECTION_NAME = 'articleConsultations';

/**
 * Retrieves consultations for a given Field Note, querying Firestore and falling back to seed data.
 */
export async function getArticleConsultations(articleId?: string): Promise<ArticleConsultation[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    let q = query(colRef, orderBy('createdAt', 'desc'));
    if (articleId) {
      q = query(colRef, where('articleId', '==', articleId), orderBy('createdAt', 'desc'));
    }
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const list: ArticleConsultation[] = [];
      snapshot.forEach(snap => {
        list.push({
          ...(snap.data() as ArticleConsultation),
          id: snap.id
        });
      });
      return list;
    }
  } catch (error) {
    console.warn('[ConsultationsRepository] Firestore query returned empty or failed:', error);
  }

  // Fallback to static sample consultations
  if (articleId) {
    return ARTICLE_CONSULTATIONS.filter(c => c.articleId === articleId);
  }
  return [...ARTICLE_CONSULTATIONS];
}

/**
 * Saves a new user question to Firestore.
 */
export async function createArticleConsultation(
  data: Omit<ArticleConsultation, 'id' | 'createdAt'> & { id?: string }
): Promise<string> {
  const id = data.id || `consult_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const docRef = doc(db, COLLECTION_NAME, id);

  const payload: ArticleConsultation = {
    ...data,
    id,
    createdAt: now,
    status: data.status || 'PENDING',
    entitlementRequired: data.entitlementRequired || 'ask_mina_token',
    isPublishedPublicly: Boolean(data.isPublishedPublicly)
  };

  await setDoc(docRef, payload);
  return id;
}
