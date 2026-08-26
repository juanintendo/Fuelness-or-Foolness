import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FieldNote } from '../types';
import { FIELD_NOTES } from '../data/fieldNotesData';
import { canAccessFieldNote, UserTier } from '../utils/entitlements';

const COLLECTION_NAME = 'fieldNotes';

/**
 * Normalizes and sanitizes a Field Note document based on reader entitlement tier.
 */
export function sanitizeFieldNoteForTier(note: FieldNote, tier: UserTier = 'free', now: Date = new Date()): FieldNote {
  const access = canAccessFieldNote(tier, note, now);
  return {
    ...note,
    premiumContentParagraphs: access.canAccessFull ? (note.premiumContentParagraphs || []) : [],
    content: access.canAccessFull ? (note.content || []) : (note.publicPreviewParagraphs || []),
  };
}

/**
 * Retrieves all Field Notes, querying Firestore first and falling back to static seed data if empty.
 */
export async function getFieldNotes(tier: UserTier = 'free'): Promise<FieldNote[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy('chapterNumber', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const notes: FieldNote[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as FieldNote;
        notes.push({
          ...data,
          id: docSnap.id
        });
      });
      return notes.map(note => sanitizeFieldNoteForTier(note, tier));
    }
  } catch (error) {
    console.warn('[FieldNotesRepository] Firestore query returned empty or encountered an issue. Using static corpus fallback:', error);
  }

  // Graceful fallback to static seed data
  return FIELD_NOTES.map(note => sanitizeFieldNoteForTier(note, tier));
}

/**
 * Retrieves a single Field Note by its ID or slug.
 */
export async function getFieldNoteById(idOrSlug: string, tier: UserTier = 'free'): Promise<FieldNote | null> {
  try {
    // First attempt direct ID fetch
    const docRef = doc(db, COLLECTION_NAME, idOrSlug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FieldNote;
      return sanitizeFieldNoteForTier({ ...data, id: docSnap.id }, tier);
    }

    // Attempt querying by slug if direct ID did not match
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      for (const snap of snapshot.docs) {
        const data = snap.data() as FieldNote;
        if (data.slug === idOrSlug || snap.id === idOrSlug) {
          return sanitizeFieldNoteForTier({ ...data, id: snap.id }, tier);
        }
      }
    }
  } catch (error) {
    console.warn(`[FieldNotesRepository] Firestore fetch for ${idOrSlug} failed, falling back to static dataset:`, error);
  }

  // Fallback to static seed data
  const staticNote = FIELD_NOTES.find(n => n.id === idOrSlug || n.slug === idOrSlug);
  if (!staticNote) {
    return null;
  }
  return sanitizeFieldNoteForTier(staticNote, tier);
}

/**
 * Returns raw, unsanitized field notes for admin/internal indexing only.
 */
export async function getRawFieldNotes(): Promise<FieldNote[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(docSnap => ({ ...(docSnap.data() as FieldNote), id: docSnap.id }));
    }
  } catch (error) {
    console.warn('[FieldNotesRepository] Could not fetch raw notes from Firestore, returning static:', error);
  }
  return [...FIELD_NOTES];
}
