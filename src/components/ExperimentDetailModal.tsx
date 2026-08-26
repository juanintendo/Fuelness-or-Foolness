import React from 'react';
import { Experiment } from '../types';
import { X, FlaskConical, ShieldAlert, CheckCircle2, AlertTriangle, BookOpen, Quote, Sparkles, Scale, FileText } from 'lucide-react';

interface ExperimentDetailModalProps {
  experiment: Experiment | null;
  onClose: () => void;
  onSelectFieldNote?: (fnId: string) => void;
}

export const ExperimentDetailModal: React.FC<ExperimentDetailModalProps> = ({
  experiment,
  onClose,
  onSelectFieldNote
}) => {
  if (!experiment) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-serif">
      <div 
        className="relative w-full max-w-4xl bg-[#F4F1EA] border border-[#1E1E1E]/20 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] bg-red-900 text-white px-2.5 py-0.5 font-bold">
              {experiment.code}
            </span>
            <span className="text-[#1E1E1E]/20">|</span>
            <span className="text-xs text-[#1E1E1E]/70 font-sans">
              {experiment.phase}
            </span>
            <span className="text-[#1E1E1E]/20 hidden sm:inline">|</span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 border border-[#1E1E1E]/20 hidden sm:inline">
              STATUS: {experiment.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] transition-colors cursor-pointer"
            title="Close dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 space-y-8 bg-[#F4F1EA]">
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-[#1E1E1E]/10">
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#1E1E1E] italic">
              {experiment.title}
            </h1>
            <p className="text-lg text-[#1E1E1E]/80 font-editorial">
              {experiment.subtitle}
            </p>
            <div className="flex items-center space-x-3 text-xs font-mono-code text-[#1E1E1E]/60 pt-1">
              <span>Sample Size: <strong className="text-[#1E1E1E]">{experiment.sampleSize}</strong></span>
              <span>•</span>
              <span>Ethical Review: <strong className="text-emerald-800">{experiment.ethicalReviewStatus}</strong></span>
            </div>
          </div>

          {/* Quantitative Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 bg-[#EBE7DE] border border-[#1E1E1E]/10">
            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/60">Fuel Score</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold font-mono-code text-red-900">{experiment.metrics?.fuelScore ?? 50}%</span>
                <span className="text-[10px] text-[#1E1E1E]/60 font-sans">Curiosity</span>
              </div>
              <div className="w-full bg-[#1E1E1E]/10 h-1">
                <div className="bg-red-900 h-full" style={{ width: `${experiment.metrics?.fuelScore ?? 50}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/60">Fool Score</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold font-mono-code text-[#1E1E1E]">{experiment.metrics?.foolScore ?? 50}%</span>
                <span className="text-[10px] text-[#1E1E1E]/60 font-sans">Projection</span>
              </div>
              <div className="w-full bg-[#1E1E1E]/10 h-1">
                <div className="bg-[#1E1E1E] h-full" style={{ width: `${experiment.metrics?.foolScore ?? 50}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/60">Friction Index</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold font-mono-code text-[#1E1E1E]">{experiment.metrics?.frictionIndex ?? 50}/100</span>
                <span className="text-[10px] text-[#1E1E1E]/60 font-sans">Resistance</span>
              </div>
              <div className="w-full bg-[#1E1E1E]/10 h-1">
                <div className="bg-[#1E1E1E]/70 h-full" style={{ width: `${experiment.metrics?.frictionIndex ?? 50}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/60">Sycophancy Penalty</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold font-mono-code text-red-900">{experiment.metrics?.sycophancyPenalty ?? 50}%</span>
                <span className="text-[10px] text-[#1E1E1E]/60 font-sans">Compliance</span>
              </div>
              <div className="w-full bg-[#1E1E1E]/10 h-1">
                <div className="bg-red-900/60 h-full" style={{ width: `${experiment.metrics?.sycophancyPenalty ?? 50}%` }} />
              </div>
            </div>
          </div>

          {/* Research Question & Hypothesis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-l-2 border-[#1E1E1E] bg-[#EBE7DE] space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/70 tracking-wider">
                Core Research Question
              </span>
              <p className="text-base text-[#1E1E1E] font-editorial italic leading-relaxed">
                "{experiment.researchQuestion}"
              </p>
            </div>

            <div className="p-5 border-l-2 border-[#1E1E1E]/40 bg-[#EBE7DE] space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold text-red-900 tracking-wider">
                Formal Hypothesis
              </span>
              <p className="text-base text-[#1E1E1E] font-editorial leading-relaxed">
                {experiment.hypothesis}
              </p>
            </div>
          </div>

          {/* Methodology */}
          <div className="space-y-2">
            <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">Methodology & Experimental Protocol</h3>
            <div className="p-5 border border-[#1E1E1E]/10 bg-[#EBE7DE] text-base text-[#1E1E1E]/90 font-editorial leading-relaxed">
              {experiment.methodology}
            </div>
          </div>

          {/* Key Observations */}
          <div className="space-y-3">
            <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">Empirical Observations</h3>
            <div className="space-y-2">
              {experiment.observations.map((obs, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 border border-[#1E1E1E]/10 bg-[#EBE7DE] text-base text-[#1E1E1E]/90">
                  <span className="font-sans text-xs text-red-900 font-bold mt-0.5">#{i + 1}</span>
                  <p className="font-editorial leading-relaxed">{obs}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Logs */}
          {experiment.logs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">Interaction Log Extracts</h3>
              <div className="space-y-2 font-mono-code text-xs">
                {experiment.logs.map((log, idx) => (
                  <div key={idx} className="p-4 border border-[#1E1E1E]/15 bg-[#EBE7DE]/70 space-y-2">
                    <div className="flex items-center justify-between text-[#1E1E1E]/60 text-[11px]">
                      <span>{log.timestamp} • <strong className="text-[#1E1E1E]">{log.agent}</strong></span>
                      <span className="px-1.5 py-0.5 bg-[#F4F1EA] border border-[#1E1E1E]/20 text-[#1E1E1E] text-[10px]">{log.action}</span>
                    </div>
                    {log.transcriptSnippet && (
                      <div className="p-3 bg-[#F4F1EA] text-[#1E1E1E] border-l-2 border-[#1E1E1E] font-editorial text-sm italic">
                        {log.transcriptSnippet}
                      </div>
                    )}
                    <p className="text-[#1E1E1E]/80 font-sans text-xs">{log.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mina's Interpretation vs Adversarial Fool Detector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border-l-2 border-[#1E1E1E] bg-[#EBE7DE] space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold text-red-900 tracking-wider">
                Mina's Epistemic Interpretation
              </span>
              <p className="text-base text-[#1E1E1E] font-editorial italic leading-relaxed">
                "{experiment.minaInterpretation}"
              </p>
            </div>

            <div className="p-5 border-l-2 border-[#1E1E1E]/40 bg-[#EBE7DE] space-y-2">
              <span className="text-[10px] font-sans uppercase font-bold text-[#1E1E1E]/70 tracking-wider">
                Adversarial Fool Detector Audit
              </span>
              <p className="text-xs text-[#1E1E1E]/90 font-mono-code leading-relaxed">
                {experiment.foolDetectorAdversarialReview}
              </p>
            </div>
          </div>

          {/* Limitations & Conclusion */}
          <div className="space-y-4 pt-4 border-t border-[#1E1E1E]/10">
            <div className="space-y-2">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">Formal Conclusion</h3>
              <p className="text-base text-[#1E1E1E] font-editorial leading-relaxed p-5 border border-[#1E1E1E]/10 bg-[#EBE7DE]">
                {experiment.conclusion}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/60 font-bold">Methodological Limitations</h3>
              <ul className="list-disc list-inside text-xs text-[#1E1E1E]/80 font-editorial space-y-1">
                {experiment.limitations.map((lim, i) => (
                  <li key={i}>{lim}</li>
                ))}
              </ul>
            </div>

            {experiment.citations.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/60 font-bold">Academic Literature Citations</h3>
                <div className="space-y-1 text-xs text-[#1E1E1E]/70 font-mono-code">
                  {experiment.citations.map((c, i) => (
                    <div key={i}>[{i + 1}] {c}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#EBE7DE] border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs text-[#1E1E1E]/70 font-sans">
          <span className="font-mono-code">
            Artifact Code: {experiment.code} • Fuel or Fool Laboratory
          </span>
          <div className="flex items-center space-x-3">
            {experiment.relatedFieldNoteId && (
              <button
                onClick={() => {
                  onClose();
                  onSelectFieldNote?.(experiment.relatedFieldNoteId!);
                }}
                className="px-4 py-2 border border-[#1E1E1E] bg-[#1E1E1E] text-[#F4F1EA] text-xs uppercase tracking-wider hover:bg-[#1E1E1E]/80 transition-colors cursor-pointer"
              >
                Read Companion Field Note Chapter
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
