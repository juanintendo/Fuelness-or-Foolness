import { SubscriptionTier } from '../types';

/**
 * Configurable Subscription Tiers
 * Prepared for real product datasets and future Firebase Auth / Stripe entitlement syncing.
 * Prices and parameters remain configurable.
 */
export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'tier-dispatch-reader',
    name: "Dispatch Reader",
    slug: 'dispatch-reader',
    code: 'DISPATCH_READER',
    tagline: "Free weekly access to Mina's evolving field monograph.",
    description: "Access the weekly Field Note during its public free window, explore public experimental conclusions, and monitor the live Laboratory Telemetry stream.",
    priceDisplay: "Free / Public Access",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    currency: "USD",
    billingInterval: 'flexible',
    accessLevel: 'public',
    consultationCreditsIncluded: 0,
    isPopular: false,
    isConfigurable: true,
    status: 'ACTIVE',
    features: [
      "Access to weekly Field Notes during the 7-day public window",
      "Real-time Laboratory Telemetry & autonomous execution stream",
      "Public summaries of concluded Controlled Experiments",
      "Anonymized high-level Case Study digests",
      "Eligibility to submit public commissions via Consulting Doors"
    ]
  },
  {
    id: 'tier-lab-fellow',
    name: "Lab Fellow",
    slug: 'lab-fellow',
    code: 'LAB_FELLOW',
    tagline: "The complete archive, premium monographs, and monthly consultations.",
    description: "Full unredacted access to all 8+ Field Note chapters, complete experiment data logs, turn-by-turn case autopsies, and direct article-level 'Ask Mina' consultation credits.",
    priceDisplay: "Configurable / Tier 2",
    monthlyPriceUsd: 18,
    annualPriceUsd: 180,
    currency: "USD",
    billingInterval: 'monthly',
    accessLevel: 'premium',
    consultationCreditsIncluded: 2,
    isPopular: true,
    isConfigurable: true,
    status: 'ACTIVE',
    features: [
      "Unrestricted permanent access to the complete Field Notes monograph archive",
      "Unredacted raw experiment data logs, prompts, and adversarial reviews",
      "Full turn-by-turn annotated Forensic Case Autopsies",
      "2 monthly Article-Specific 'Ask Mina' consultation tokens",
      "Priority processing on Seduction Audits and Interaction Autopsies",
      "Participation in private epistemic reflection sessions"
    ]
  },
  {
    id: 'tier-patron-of-desire',
    name: "Patron of the Laboratory",
    slug: 'patron-of-desire',
    code: 'PATRON_OF_DESIRE',
    tagline: "Direct commission privileges, custom protocol design, and private salon.",
    description: "Dedicated research commissions, quarterly bespoke experimental protocol synthesis, confidential vault storage for case autopsies, and direct dialogue with the editorial team.",
    priceDisplay: "Configurable / Patron Tier",
    monthlyPriceUsd: 75,
    annualPriceUsd: 750,
    currency: "USD",
    billingInterval: 'monthly',
    accessLevel: 'premium',
    consultationCreditsIncluded: 10,
    isPopular: false,
    isConfigurable: true,
    status: 'ACTIVE',
    features: [
      "All Lab Fellow entitlements with unlimited consultation tokens",
      "One bespoke Experimental Protocol design per quarter (Door 04)",
      "Direct confidential vault storage for personal case audits (zero public indexing)",
      "Invitation to quarterly closed-door epistemic salons",
      "Named patron acknowledgment on published research monographs (optional)"
    ]
  }
];
