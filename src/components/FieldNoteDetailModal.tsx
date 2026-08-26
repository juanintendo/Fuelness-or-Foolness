import React, { useState } from 'react';
import { FieldNote } from '../types';
import { X, BookOpen, Clock, Flame, ShieldAlert, Sparkles, MessageSquare, ArrowRight, Share2, Check, Send, Loader2, Lock, LogIn, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccessFieldNote, canSubmitArticleConsultation } from '../utils/entitlements';
import { PremiumContentGate } from './PremiumContentGate';
import { createArticleConsultation } from '../repositories/consultationsRepository';

interface FieldNoteDetailModalProps {
  note: FieldNote | null;
  onClose: () => void;
  onSelectExperiment?: (expId: string) => void;
}

export const FieldNoteDetailModal: React.FC<FieldNoteDetailModalProps> = ({
  note,
  onClose,
  onSelectExperiment
}) => {
  const { user, profile, signIn, updateTier } = useAuth();
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [consultQuestion, setConsultQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  if (!note) return null;

  const accessResult = canAccessFieldNote(profile?.tier, note);
  const canSubmitConsult = canSubmitArticleConsultation(profile?.tier);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskMina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultQuestion.trim() || !canSubmitConsult) return;

    setIsSubmittingQuestion(true);
    try {
      await createArticleConsultation({
        articleId: note.id,
        userId: user ? user.uid : 'anonymous',
        userDisplayName: user?.displayName || 'Anonymous Reader',
        question: consultQuestion.slice(0, 1000),
        response: null,
        status: 'PENDING',
        entitlementRequired: 'premium'
      });
    } catch (err) {
      console.warn('Note: Could not persist consultation to repository/Firestore:', err);
    } finally {
      setIsSubmittingQuestion(false);
      setQuestionSubmitted(true);
      setConsultQuestion('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-serif">
      <div 
        className="relative w-full max-w-4xl bg-[#F4F1EA] border border-[#1E1E1E]/20 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] bg-red-900 text-white px-2 py-0.5 font-bold">
              CHAPTER 0{note.chapterNumber}
            </span>
            <span className="text-[#1E1E1E]/20">|</span>
            <div className="flex items-center space-x-1.5 text-xs text-[#1E1E1E]/70 font-sans">
              <Clock className="w-3.5 h-3.5 text-[#1E1E1E]/60" />
              <span>{note.readingTimeMinutes} min read</span>
            </div>
            <span className="text-[#1E1E1E]/20 hidden sm:inline">|</span>
            <span className="text-xs text-[#1E1E1E]/70 font-sans hidden sm:inline">
              Published: {note.publicationDate}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
              className="px-2.5 py-1 text-xs border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] font-sans transition-colors cursor-pointer"
              title="Toggle reading font size"
            >
              {fontSize === 'normal' ? 'A+' : 'A-'}
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] transition-colors cursor-pointer"
              title="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Epistemic Status Banner & Access Indicator */}
        <div className="px-6 py-2.5 bg-[#EBE7DE]/70 border-b border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-3 text-[#1E1E1E]/80">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-900" />
              <span className="uppercase tracking-wider font-semibold">STATUS: {note.epistemicStatus}</span>
            </div>
            <span className="text-[#1E1E1E]/30 hidden md:inline">|</span>
            <span className="hidden md:inline font-mono-code text-[11px] text-[#1E1E1E]/70">
              {accessResult.statusLabel}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[#1E1E1E]/60 text-[11px] font-mono-code">
            <span>FUEL: <strong className="text-red-900">{note.fuelFoolBalance.fuelScore}%</strong></span>
            <span>FOOL: <strong className="text-[#1E1E1E]">{note.fuelFoolBalance.foolScore}%</strong></span>
          </div>
        </div>

        {/* Scrollable Reader Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-14 py-10 bg-[#F4F1EA]">
          {/* Chapter Title & Subtitle */}
          <div className="space-y-4 mb-10 pb-8 border-b border-[#1E1E1E]/10">
            <h1 className="font-editorial text-3xl sm:text-5xl text-[#1E1E1E] tracking-tight leading-[1.05] italic">
              {note.title}
            </h1>
            <p className="text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
              {note.subtitle}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-xs font-sans uppercase tracking-wider bg-[#EBE7DE] border border-[#1E1E1E]/10 text-[#1E1E1E]/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Entitlement-Gated Body Paragraphs with Marginalia Sidebars */}
          <div className={`${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
            <PremiumContentGate
              note={note}
              accessResult={accessResult}
              publicParagraphs={note.publicPreviewParagraphs || [note.publicExcerpt]}
              fullParagraphs={accessResult.canAccessFull ? note.content : (note.publicPreviewParagraphs || [note.publicExcerpt])}
              marginalia={note.marginalia}
            />
          </div>

          {/* Article-Specific Consultation: Ask Mina on this Chapter */}
          <div className="mt-14 p-6 sm:p-8 bg-[#EBE7DE] border border-[#1E1E1E]/15 space-y-4">
            <div className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter Consultation • Ask Mina & The Lab</span>
            </div>
            <h3 className="text-xl font-editorial italic text-[#1E1E1E]">
              Have a question regarding Chapter 0{note.chapterNumber}'s tension dynamics?
            </h3>
            <p className="text-xs text-[#1E1E1E]/70 font-editorial">
              Submit your inquiry to the laboratory queue. Submissions are reviewed under Mina's editorial docket and archived for future research dispatches.
            </p>

            {canSubmitConsult ? (
              questionSubmitted ? (
                <div className="p-4 bg-[#F4F1EA] border border-emerald-800/30 text-emerald-900 text-xs font-sans space-y-1 flex items-start space-x-3">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider">Inquiry Queued Successfully</p>
                    <p className="font-editorial text-[#1E1E1E]/80">Your question has been logged to the laboratory docket for Chapter 0{note.chapterNumber}.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAskMina} className="space-y-3">
                  <textarea
                    value={consultQuestion}
                    onChange={(e) => setConsultQuestion(e.target.value)}
                    placeholder={`Ask a question or propose a counterpoint regarding "${note.title}"...`}
                    rows={3}
                    className="w-full bg-[#F4F1EA] border border-[#1E1E1E]/20 p-3 text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#1E1E1E] font-editorial resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!consultQuestion.trim() || isSubmittingQuestion}
                    className="px-4 py-2 bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 disabled:opacity-50 text-xs font-sans uppercase tracking-widest flex items-center space-x-2 transition-colors cursor-pointer"
                  >
                    {isSubmittingQuestion ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Chapter Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )
            ) : (
              /* Entitlement Teaser Card for non-fellows */
              <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/15 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-wider text-red-900">
                  <Lock className="w-3.5 h-3.5 text-red-900" />
                  <span>Lab Fellow or Patron Pass Required for Submissions</span>
                </div>
                <p className="text-xs text-[#1E1E1E]/80 font-editorial leading-relaxed">
                  Chapter deliberations and adversarial counterpoint audits are processed under the Lab Fellow ($18/mo) & Research Patron ($75/mo) dockets.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {user ? (
                    <button
                      onClick={() => updateTier('fellow')}
                      className="px-4 py-1.5 bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 text-xs font-sans uppercase tracking-widest flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Activate Lab Fellow Pass</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => signIn()}
                      className="px-4 py-1.5 bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 text-xs font-sans uppercase tracking-widest flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Sign In with Google</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Empirical Experiments */}
          {note.relatedExperimentIds.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[#1E1E1E]/10 space-y-4">
              <h3 className="text-xs uppercase font-sans tracking-[0.2em] text-[#1E1E1E]/60 flex items-center space-x-2 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-red-900" />
                <span>Empirical Experiments Linked to this Chapter</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {note.relatedExperimentIds.map((expId) => (
                  <button
                    key={expId}
                    onClick={() => {
                      onClose();
                      onSelectExperiment?.(expId);
                    }}
                    className="p-4 border border-[#1E1E1E]/10 bg-[#EBE7DE] hover:border-[#1E1E1E]/40 text-left group transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-xs text-red-900 uppercase tracking-widest">
                        {expId.toUpperCase()}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#1E1E1E]/60 group-hover:text-[#1E1E1E] group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-[#1E1E1E]/80 mt-1 font-editorial italic">
                      Inspect laboratory methodology & quantitative telemetry &rarr;
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EBE7DE] border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs text-[#1E1E1E]/70 font-sans">
          <span className="font-editorial italic">
            "Mina's Field Guide to Seduction" • Fuel or Fool Research Lab
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E1E1E] text-[#F4F1EA] text-xs uppercase tracking-widest hover:bg-[#1E1E1E]/80 font-sans transition-colors cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};

