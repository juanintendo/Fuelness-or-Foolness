import { FieldNote } from '../types';

export type UserTier = 'free' | 'dispatch' | 'fellow' | 'patron';

export type AccessReason = 
  | 'foundation_public' 
  | 'weekly_free_window' 
  | 'entitled_tier' 
  | 'expired_weekly' 
  | 'premium_required' 
  | 'internal_restricted'
  | 'public';

export interface FieldNoteAccessResult {
  canAccessFull: boolean;
  reason: AccessReason;
  isWeeklyActive: boolean;
  isFoundationPublic: boolean;
  isExpiredWeekly: boolean;
  daysRemainingInWindow?: number;
  hoursRemainingInWindow?: number;
  requiredTier: UserTier;
  canSubmitConsultation: boolean;
  statusLabel: string;
}

/**
 * Evaluates whether a user tier can access the complete unredacted Field Note content.
 * 
 * Rules:
 * - Public content / Foundation chapters (freeUntil === null) are open to all.
 * - Weekly featured field notes are 100% readable during their 7-day public window (now < freeUntil).
 * - After the free window expires or for premium monograph chapters: requires a paid tier ('dispatch', 'fellow', or 'patron').
 * - Internal restricted content is blocked from normal users.
 */
export function canAccessFieldNote(
  tier: UserTier | undefined,
  note: FieldNote,
  now: Date = new Date()
): FieldNoteAccessResult {
  const currentTier: UserTier = tier || 'free';
  const hasPaidTier = currentTier === 'dispatch' || currentTier === 'fellow' || currentTier === 'patron';
  const canSubmitConsultation = currentTier === 'fellow' || currentTier === 'patron';

  // Internal restricted content
  if (note.accessLevel === 'internal') {
    return {
      canAccessFull: false,
      reason: 'internal_restricted',
      isWeeklyActive: false,
      isFoundationPublic: false,
      isExpiredWeekly: false,
      requiredTier: 'patron',
      canSubmitConsultation: false,
      statusLabel: 'Internal Laboratory Protocol'
    };
  }

  // Foundation chapter (permanently public)
  if (note.accessLevel === 'public' && note.freeUntil === null) {
    return {
      canAccessFull: true,
      reason: 'foundation_public',
      isWeeklyActive: false,
      isFoundationPublic: true,
      isExpiredWeekly: false,
      requiredTier: 'free',
      canSubmitConsultation,
      statusLabel: 'Foundation Chapter • Open Access'
    };
  }

  // Weekly Field Note with a temporal free window
  if (note.freeUntil) {
    const freeUntilTime = new Date(note.freeUntil).getTime();
    const nowTime = now.getTime();
    const isStillActiveWindow = nowTime < freeUntilTime;

    if (isStillActiveWindow) {
      const diffMs = freeUntilTime - nowTime;
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const hoursRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));

      return {
        canAccessFull: true,
        reason: 'weekly_free_window',
        isWeeklyActive: true,
        isFoundationPublic: false,
        isExpiredWeekly: false,
        daysRemainingInWindow: daysRemaining,
        hoursRemainingInWindow: hoursRemaining,
        requiredTier: 'free',
        canSubmitConsultation,
        statusLabel: `Weekly Open Dispatch (${daysRemaining}d remaining)`
      };
    } else {
      // Window has elapsed -> archived to premium
      if (hasPaidTier) {
        return {
          canAccessFull: true,
          reason: 'entitled_tier',
          isWeeklyActive: false,
          isFoundationPublic: false,
          isExpiredWeekly: true,
          requiredTier: 'dispatch',
          canSubmitConsultation,
          statusLabel: 'Archived Monograph • Unlocked with Subscription'
        };
      } else {
        return {
          canAccessFull: false,
          reason: 'expired_weekly',
          isWeeklyActive: false,
          isFoundationPublic: false,
          isExpiredWeekly: true,
          requiredTier: 'dispatch',
          canSubmitConsultation: false,
          statusLabel: 'Archived to Monograph • Dispatch or Fellow Pass Required'
        };
      }
    }
  }

  // Standard Premium content (no free window)
  if (note.accessLevel === 'premium') {
    if (hasPaidTier) {
      return {
        canAccessFull: true,
        reason: 'entitled_tier',
        isWeeklyActive: false,
        isFoundationPublic: false,
        isExpiredWeekly: false,
        requiredTier: 'dispatch',
        canSubmitConsultation,
        statusLabel: 'Research Monograph • Unlocked'
      };
    } else {
      return {
        canAccessFull: false,
        reason: 'premium_required',
        isWeeklyActive: false,
        isFoundationPublic: false,
        isExpiredWeekly: false,
        requiredTier: 'dispatch',
        canSubmitConsultation: false,
        statusLabel: 'Monograph • Dispatch Pass Required'
      };
    }
  }

  // Standard Public content
  return {
    canAccessFull: true,
    reason: 'public',
    isWeeklyActive: false,
    isFoundationPublic: false,
    isExpiredWeekly: false,
    requiredTier: 'free',
    canSubmitConsultation,
    statusLabel: 'Public Dispatch'
  };
}

/**
 * Checks if user tier is permitted to submit article consultations to Ask Mina.
 */
export function canSubmitArticleConsultation(tier: UserTier | undefined): boolean {
  return tier === 'fellow' || tier === 'patron';
}
