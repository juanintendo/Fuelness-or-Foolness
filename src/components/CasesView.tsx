import React, { useState, useEffect } from 'react';
import { getCases } from '../repositories/casesRepository';
import { Layers, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, MessageSquare, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { InteractionCase } from '../types';

export const CasesView: React.FC = () => {
  const [cases, setCases] = useState<InteractionCase[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      setIsLoading(true);
      try {
        const fetched = await getCases();
        if (isMounted) {
          setCases(fetched);
          if (fetched.length > 0) {
            setSelectedCaseId(fetched[0].id);
          }
        }
      } catch (err) {
        console.error('[CasesView] Failed to fetch cases:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-12 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Interaction Autopsies • Case Archive
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          Anonymized Cases
        </h1>
        <p className="text-lg sm:text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
          Line-by-line autopsies of real-world text exchanges, dating app banter, and late-night LLM dialogues answering the essential question: <em>"What actually happened here?"</em>
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#1E1E1E]/60 border border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <Loader2 className="w-6 h-6 animate-spin text-[#1E1E1E]" />
          <span className="text-xs font-sans uppercase tracking-widest">Accessing Forensic Archives...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="py-16 text-center border border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <p className="font-editorial text-lg text-[#1E1E1E]">No autopsy dossiers found.</p>
        </div>
      ) : (
        <>
          {/* Case Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cases.map((c) => {
              const isSelected = c.id === activeCase?.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-5 text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E1E1E] text-[#F4F1EA] border-[#1E1E1E]'
                      : 'bg-[#EBE7DE] border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30 text-[#1E1E1E]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider mb-1.5">
                    <span className={`font-bold ${isSelected ? 'text-red-400' : 'text-red-900'}`}>
                      {c.code}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-[#F4F1EA]/60' : 'text-[#1E1E1E]/60'}`}>{c.contextType}</span>
                  </div>
                  <h3 className="font-editorial text-base font-semibold truncate">
                    {c.title}
                  </h3>
                  <p className={`text-xs mt-1 font-mono-code truncate ${isSelected ? 'text-[#F4F1EA]/70' : 'text-[#1E1E1E]/70'}`}>
                    {c.foolOrFuelVerdict.ratio}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Case Deep-Dive Autopsy Dossier */}
          {activeCase && (
            <div className="p-8 sm:p-12 border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-10">
        {/* Case Header */}
        <div className="space-y-4 pb-8 border-b border-[#1E1E1E]/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 bg-red-900 text-white font-sans text-xs uppercase tracking-widest font-bold">
                {activeCase.code}
              </span>
              <span className="text-xs font-sans text-[#1E1E1E]/70">
                Context: <strong className="text-[#1E1E1E]">{activeCase.contextType}</strong>
              </span>
            </div>
            <span className="text-xs font-mono-code text-[#1E1E1E]/60">
              Subject: {activeCase.anonymizedSubject}
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E1E1E] italic">
            {activeCase.title}
          </h2>
          <p className="text-lg text-[#1E1E1E]/80 font-editorial leading-relaxed max-w-3xl">
            {activeCase.summary}
          </p>

          <div className="p-5 border-l-2 border-[#1E1E1E] bg-[#F4F1EA] font-editorial italic text-red-950 text-base leading-relaxed">
            Key Diagnostic Snippet: "{activeCase.snippet}"
          </div>
        </div>

        {/* Turn-by-Turn Timeline Autopsy */}
        <div className="space-y-4">
          <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-red-900" />
            <span>Turn-by-Turn Timeline Autopsy</span>
          </h3>

          <div className="space-y-4 font-sans text-xs">
            {activeCase.timeline.map((turn, idx) => (
              <div key={idx} className="p-5 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-2">
                <div className="flex items-center justify-between text-[#1E1E1E]/60 text-[11px] font-mono-code">
                  <span className="font-bold text-[#1E1E1E]">TURN {idx + 1}: {turn.speaker}</span>
                  <div className="flex items-center space-x-3">
                    <span className="px-1.5 py-0.5 bg-[#EBE7DE] border border-[#1E1E1E]/10 text-[#1E1E1E] uppercase text-[10px]">
                      {turn.signalType}
                    </span>
                    <span className="text-red-900">+{turn.fuelContribution}% Fuel</span>
                    <span className="text-[#1E1E1E]">+{turn.foolContribution}% Fool</span>
                  </div>
                </div>

                <p className="text-base font-editorial text-[#1E1E1E] italic p-3 bg-[#EBE7DE] border-l-2 border-[#1E1E1E]">
                  "{turn.message}"
                </p>

                <p className="text-[#1E1E1E]/80 text-sm font-editorial">
                  <strong className="text-red-900 font-sans text-xs uppercase tracking-wider">Analysis:</strong> {turn.annotation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytical Vectors Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-3">
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
              Tension & Seduction Dynamics
            </h4>
            <p className="text-base text-[#1E1E1E] font-editorial leading-relaxed">
              {activeCase.tensionDynamics}
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">Identified Signals:</span>
              <ul className="list-disc list-inside text-sm text-[#1E1E1E]/80 font-editorial mt-1 space-y-1">
                {activeCase.attractionSignals.map((sig, i) => (
                  <li key={i}>{sig}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-3">
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/80 font-bold">
              Reciprocity & Projection Audit
            </h4>
            <p className="text-base text-[#1E1E1E] font-editorial leading-relaxed">
              {activeCase.reciprocityEvaluation}
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">Projection Risks:</span>
              <ul className="list-disc list-inside text-sm text-[#1E1E1E]/80 font-editorial mt-1 space-y-1">
                {activeCase.projectionRisks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Verdict: Fuel or Fool Ruling */}
        <div className="p-8 border-2 border-[#1E1E1E] bg-[#F4F1EA] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 font-sans text-xs">
              <Sparkles className="w-4 h-4 text-red-900" />
              <span className="uppercase text-[#1E1E1E] tracking-widest font-bold">Final Laboratory Verdict</span>
            </div>
            <span className="px-3 py-1 bg-[#1E1E1E] font-mono-code text-xs font-bold text-[#F4F1EA]">
              {activeCase.foolOrFuelVerdict.ratio}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
              Ruling: <span className="text-red-900">{activeCase.foolOrFuelVerdict.ruling.replace(/_/g, ' ')}</span>
            </h4>
            <p className="text-base text-[#1E1E1E]/90 font-editorial leading-relaxed">
              {activeCase.foolOrFuelVerdict.rationale}
            </p>
          </div>

          <div className="pt-4 border-t border-[#1E1E1E]/10 space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-widest text-red-900 font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Recommended Behavioral Protocols</span>
            </span>
            <ul className="list-disc list-inside text-sm text-[#1E1E1E]/90 font-editorial space-y-1">
              {activeCase.recommendedProtocols.map((proto, i) => (
                <li key={i}>{proto}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}
  </>
)}
</div>
  );
};
