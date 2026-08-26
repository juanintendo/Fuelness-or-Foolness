import React, { useState } from 'react';
import { FieldNote } from '../types';
import { X, BookOpen, Clock, Flame, ShieldAlert, Sparkles, MessageSquare, ArrowRight, Share2, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  if (!note) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Epistemic Status Banner */}
        <div className="px-6 py-2.5 bg-[#EBE7DE]/70 border-b border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center space-x-2 text-[#1E1E1E]/80">
            <span className="w-2 h-2 rounded-full bg-red-900" />
            <span className="uppercase tracking-wider font-semibold">EPISTEMIC STATUS: {note.epistemicStatus}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[#1E1E1E]/60 text-[11px] font-mono-code">
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

          {/* Body Paragraphs with Marginalia Sidebars */}
          <div className={`space-y-6 ${fontSize === 'large' ? 'text-xl leading-relaxed' : 'text-lg leading-relaxed'} text-[#1E1E1E]/90 font-editorial`}>
            {note.content.map((paragraph, idx) => {
              const matchedMarginalia = note.marginalia.filter((m) => m.paragraphIndex === idx);

              return (
                <div key={idx} className="space-y-4">
                  <p className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                    {paragraph}
                  </p>

                  {/* Render inline marginalia if present for this paragraph */}
                  {matchedMarginalia.map((m) => (
                    <div
                      key={m.id}
                      className="p-5 my-5 border-l-2 border-[#1E1E1E] bg-[#EBE7DE] text-xs font-sans space-y-1.5"
                    >
                      <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-red-900 text-[10px]">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{m.author} Marginalia</span>
                      </div>
                      <p className="italic text-[#1E1E1E] font-editorial text-base leading-relaxed">
                        "{m.text}"
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
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
