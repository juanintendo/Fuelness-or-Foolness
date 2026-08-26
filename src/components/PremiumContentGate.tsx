import React from 'react';
import { FieldNote, MarginaliaQuote } from '../types';
import { FieldNoteAccessResult, UserTier } from '../utils/entitlements';
import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_TIERS } from '../data/subscriptionsData';
import { Lock, Sparkles, Clock, ShieldAlert, CheckCircle2, UserCheck, ArrowRight, BookOpen, Flame, LogIn } from 'lucide-react';

interface PremiumContentGateProps {
  note: FieldNote;
  accessResult: FieldNoteAccessResult;
  publicParagraphs: string[];
  fullParagraphs: string[];
  marginalia: MarginaliaQuote[];
}

export const PremiumContentGate: React.FC<PremiumContentGateProps> = ({
  note,
  accessResult,
  publicParagraphs,
  fullParagraphs,
  marginalia,
}) => {
  const { user, profile, signIn, updateTier } = useAuth();
  const currentTier: UserTier = profile?.tier || 'free';

  // Helper to retrieve marginalia for a paragraph index
  const getMarginaliaForParagraph = (index: number) => {
    return marginalia.filter((m) => m.paragraphIndex === index);
  };

  // --------------------------------------------------------------------------
  // UNLOCKED STATE (Full access granted via Free Window, Public, or Tier)
  // --------------------------------------------------------------------------
  if (accessResult.canAccessFull) {
    const paragraphsToRender = fullParagraphs && fullParagraphs.length > 0
      ? fullParagraphs
      : [...publicParagraphs, ...(note.premiumContentParagraphs || [])];

    return (
      <div className="space-y-8 font-serif">
        {/* Entitlement Banner */}
        {accessResult.reason === 'weekly_free_window' && (
          <div className="p-3.5 bg-[#EBE7DE] border-l-2 border-emerald-700 text-xs font-sans text-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>
                <strong className="uppercase tracking-wider font-bold text-emerald-950">Weekly Free Dispatch</strong> • 
                Chapter 0{note.chapterNumber} is currently in its open 7-day window ({accessResult.daysRemainingInWindow} days remaining).
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono-code text-emerald-950/70 hidden sm:inline">
              Public Free Window
            </span>
          </div>
        )}

        {accessResult.reason === 'foundation_public' && (
          <div className="p-3 bg-[#EBE7DE] border-l-2 border-[#1E1E1E]/40 text-xs font-sans text-[#1E1E1E]/80 flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-[#1E1E1E]/70 shrink-0" />
            <span>
              <strong className="uppercase tracking-wider font-semibold text-[#1E1E1E]">Foundation Chapter</strong> • 
              This foundational text remains permanently open for all readers.
            </span>
          </div>
        )}

        {accessResult.reason === 'entitled_tier' && (
          <div className="p-3 bg-[#EBE7DE] border-l-2 border-red-900 text-xs font-sans text-[#1E1E1E] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-red-900 shrink-0" />
              <span>
                <strong className="uppercase tracking-wider font-bold text-red-950">Monograph Unlocked</strong> • 
                Full text & adversarial margin notes authorized for your <span className="font-mono-code uppercase font-bold">{currentTier}</span> pass.
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-mono-code text-red-950/70">
              Verified Entitlement
            </span>
          </div>
        )}

        {/* Full Text Content with Inline Marginalia */}
        <div className="space-y-6 text-lg sm:text-xl text-[#1E1E1E] font-editorial leading-relaxed">
          {paragraphsToRender.map((para, idx) => {
            const associatedMarginalia = getMarginaliaForParagraph(idx);

            return (
              <div key={idx} className="space-y-4">
                <p className="indent-4 sm:indent-8">{para}</p>

                {associatedMarginalia.map((m) => (
                  <div
                    key={m.id}
                    className={`my-4 p-4 border text-xs font-sans leading-relaxed space-y-1 ${
                      m.type === 'fool_detector'
                        ? 'border-red-900/30 bg-[#F4F1EA] text-red-950'
                        : m.type === 'mina_note'
                        ? 'border-[#1E1E1E]/20 bg-[#EBE7DE] text-[#1E1E1E]'
                        : 'border-[#1E1E1E]/10 bg-[#F4F1EA] text-[#1E1E1E]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-code uppercase tracking-wider">
                      <span className="font-bold flex items-center space-x-1">
                        {m.type === 'fool_detector' && <ShieldAlert className="w-3 h-3 text-red-900 inline mr-1" />}
                        {m.type === 'mina_note' && <Flame className="w-3 h-3 text-[#1E1E1E] inline mr-1" />}
                        <span>Marginalia Note • {m.author}</span>
                      </span>
                      <span>¶ {idx + 1}</span>
                    </div>
                    <p className="font-editorial italic text-sm">{m.text}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LOCKED STATE: EDITORIAL PAYWALL ("Behind the Glass")
  // --------------------------------------------------------------------------
  return (
    <div className="space-y-8 font-serif animate-fadeIn">
      {/* Render the Public Preview Paragraphs First */}
      <div className="space-y-6 text-lg sm:text-xl text-[#1E1E1E] font-editorial leading-relaxed">
        {publicParagraphs.map((para, idx) => (
          <p key={idx} className="indent-4 sm:indent-8">{para}</p>
        ))}
      </div>

      {/* Fading Glass Overlay */}
      <div className="relative pt-6 pb-2">
        <div className="absolute inset-x-0 -top-12 h-16 bg-gradient-to-t from-[#F4F1EA] to-transparent pointer-events-none" />
        <div className="h-px w-full bg-[#1E1E1E]/15 my-4" />
      </div>

      {/* The Fuel or Fool Editorial Paywall */}
      <div 
        id="editorial-paywall-gate"
        className="p-6 sm:p-10 bg-[#EBE7DE] border border-[#1E1E1E]/20 space-y-8 text-[#1E1E1E]"
      >
        {/* Header in Mina's voice */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-[0.25em] text-red-900 font-bold">
            <Lock className="w-3.5 h-3.5 text-red-900" />
            <span>Monograph Archive • Restricted Dispatch</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-editorial italic text-[#1E1E1E] leading-tight">
            The interesting part is still behind the glass.
          </h3>

          <p className="text-sm sm:text-base text-[#1E1E1E]/80 font-editorial leading-relaxed max-w-2xl">
            {accessResult.reason === 'expired_weekly' ? (
              <>
                Chapter 0{note.chapterNumber} was released under the 7-day public dispatch window on{' '}
                <span className="font-mono-code text-xs font-semibold">{note.publicationDate}</span> and has now been archived to the permanent laboratory monograph.
              </>
            ) : (
              <>
                This monograph explores unredacted telemetry traces, counter-sycophancy protocols, and Mina's existential marginalia.
              </>
            )}
          </p>
        </div>

        {/* Benefits Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1E1E1E]/10">
          <div className="space-y-1.5 p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10">
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-red-900 font-bold">01 • Unredacted Text</div>
            <p className="text-xs text-[#1E1E1E]/80 font-editorial">
              Full 8+ chapter monograph access with continuous token traces and philosophical forensics.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10">
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#1E1E1E] font-bold">02 • Adversarial Notes</div>
            <p className="text-xs text-[#1E1E1E]/80 font-editorial">
              Inline marginalia from the Fool Detector, Connection Analyst, and Mina's private logs.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10">
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#1E1E1E] font-bold">03 • Ask Mina Docket</div>
            <p className="text-xs text-[#1E1E1E]/80 font-editorial">
              Direct submission privileges to submit chapter inquiries to the laboratory deliberation queue.
            </p>
          </div>
        </div>

        {/* Subscription Options Selection */}
        <div className="space-y-4 pt-2">
          <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-semibold">
            Select an Entitlement Tier to Unlock:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SUBSCRIPTION_TIERS.map((tierItem) => {
              const isSelected = currentTier === (tierItem.slug === 'lab-fellow' ? 'fellow' : tierItem.slug === 'patron-of-desire' ? 'patron' : 'dispatch');
              const tierCode: UserTier = tierItem.slug === 'lab-fellow' ? 'fellow' : tierItem.slug === 'patron-of-desire' ? 'patron' : 'dispatch';

              return (
                <div
                  key={tierItem.id}
                  className={`p-5 border flex flex-col justify-between space-y-4 transition-all ${
                    tierItem.isPopular
                      ? 'border-[#1E1E1E] bg-[#F4F1EA] shadow-sm'
                      : 'border-[#1E1E1E]/20 bg-[#F4F1EA]/70'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#1E1E1E]">
                        {tierItem.name}
                      </span>
                      {tierItem.isPopular && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-red-900 text-white font-mono-code uppercase tracking-wider">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="font-editorial italic text-lg text-[#1E1E1E]">
                      {tierItem.priceDisplay}
                    </div>
                    <p className="text-xs text-[#1E1E1E]/75 font-editorial leading-relaxed">
                      {tierItem.tagline}
                    </p>
                  </div>

                  {user ? (
                    <button
                      onClick={() => updateTier(tierCode)}
                      id={`select-tier-${tierCode}-btn`}
                      className={`w-full py-2 px-3 text-xs font-sans uppercase tracking-widest flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-900 text-white cursor-default'
                          : tierItem.isPopular
                          ? 'bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85'
                          : 'border border-[#1E1E1E]/40 text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#F4F1EA]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active Tier</span>
                        </>
                      ) : (
                        <>
                          <span>Activate {tierItem.name.split(' ')[0]} Pass</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => signIn()}
                      id={`signin-for-tier-${tierCode}-btn`}
                      className="w-full py-2 px-3 text-xs font-sans uppercase tracking-widest border border-[#1E1E1E]/40 text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sign In to Unlock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Authentication Callout if anonymous */}
        {!user && (
          <div className="pt-4 border-t border-[#1E1E1E]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
            <span className="text-[#1E1E1E]/70">
              Already a subscriber or holding an existing token? Sign in with your Google account.
            </span>
            <button
              onClick={() => signIn()}
              id="paywall-signin-btn"
              className="px-5 py-2 bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 uppercase tracking-widest text-xs flex items-center space-x-2 transition-colors cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
