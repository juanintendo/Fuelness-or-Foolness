import React, { useState, useEffect } from 'react';
import { getExperiments } from '../repositories/experimentsRepository';
import { FlaskConical, Filter, ArrowRight, ShieldAlert, CheckCircle2, Scale, Activity, BookOpen, Loader2 } from 'lucide-react';
import { Experiment } from '../types';

interface ExperimentsViewProps {
  onOpenExperiment: (expId: string) => void;
  onOpenFieldNote?: (fnId: string) => void;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({
  onOpenExperiment,
  onOpenFieldNote
}) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CONCLUDED' | 'PEER_REVIEW'>('ALL');

  useEffect(() => {
    let isMounted = true;
    async function loadExps() {
      setIsLoading(true);
      try {
        const fetched = await getExperiments();
        if (isMounted) {
          setExperiments(fetched);
        }
      } catch (err) {
        console.error('[ExperimentsView] Failed to fetch experiments:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadExps();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExperiments = experiments.filter((exp) => {
    if (statusFilter === 'ALL') return true;
    return exp.status === statusFilter;
  });

  return (
    <div className="space-y-12 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Empirical Protocols & Metrics
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          Laboratory Experiments
        </h1>
        <p className="text-lg sm:text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
          Rigorous research protocols designed to measure attraction vectors, sycophancy penalties, anthropomorphic projection, and conversational friction across multi-turn human-synthetic interaction.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1E1E1E]/10 pb-4 overflow-x-auto">
        {(['ALL', 'ACTIVE', 'CONCLUDED', 'PEER_REVIEW'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer ${
              statusFilter === status
                ? 'bg-[#1E1E1E] text-[#F4F1EA] font-semibold'
                : 'bg-[#EBE7DE] text-[#1E1E1E]/70 hover:text-[#1E1E1E] border border-[#1E1E1E]/10'
            }`}
          >
            {status} ({status === 'ALL' ? experiments.length : experiments.filter(e => e.status === status).length})
          </button>
        ))}
      </div>

      {/* Experiments List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#1E1E1E]/60 border border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <Loader2 className="w-6 h-6 animate-spin text-[#1E1E1E]" />
          <span className="text-xs font-sans uppercase tracking-widest">Loading Controlled Protocols...</span>
        </div>
      ) : filteredExperiments.length === 0 ? (
        <div className="py-16 text-center border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-2">
          <p className="font-editorial text-lg text-[#1E1E1E]">No experiments match the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExperiments.map((exp) => (
          <div
            key={exp.id}
            onClick={() => onOpenExperiment(exp.id)}
            className="p-8 sm:p-10 border border-[#1E1E1E]/10 bg-[#EBE7DE] hover:border-[#1E1E1E]/30 cursor-pointer group transition-all space-y-6"
          >
            {/* Top row: Code + Phase + Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-sans uppercase tracking-wider">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 bg-red-900 text-white font-bold text-[10px]">
                  {exp.code}
                </span>
                <span className="text-[#1E1E1E]/20">|</span>
                <span className="text-[#1E1E1E]/70 font-mono-code text-[11px]">{exp.phase}</span>
              </div>

              <span className={`px-2.5 py-0.5 text-[10px] font-sans font-bold uppercase tracking-widest ${
                exp.status === 'CONCLUDED'
                  ? 'bg-[#1E1E1E] text-[#F4F1EA]'
                  : exp.status === 'ACTIVE'
                  ? 'bg-red-900 text-white'
                  : 'bg-[#D1CFCA] text-[#1E1E1E]'
              }`}>
                {exp.status}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] group-hover:italic transition-colors">
                {exp.title}
              </h2>
              <p className="text-sm text-red-950 font-editorial italic">
                {exp.subtitle}
              </p>
            </div>

            {/* Research Question & Hypothesis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border-l-2 border-[#1E1E1E] bg-[#F4F1EA] space-y-1 text-xs font-sans">
                <span className="text-[10px] uppercase font-bold text-[#1E1E1E]/60 tracking-wider">Research Question</span>
                <p className="text-[#1E1E1E] font-editorial text-base italic leading-relaxed">"{exp.researchQuestion}"</p>
              </div>

              <div className="p-5 border-l-2 border-[#1E1E1E]/40 bg-[#F4F1EA] space-y-1 text-xs font-sans">
                <span className="text-[10px] uppercase font-bold text-red-900 tracking-wider">Hypothesis Statement</span>
                <p className="text-[#1E1E1E] font-editorial text-base leading-relaxed">{exp.hypothesis}</p>
              </div>
            </div>

            {/* Quantitative Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 font-mono-code text-xs">
              <div>
                <span className="text-[10px] text-[#1E1E1E]/60 uppercase">Fuel Index</span>
                <div className="text-xl font-bold text-red-900">{exp.metrics.fuelScore}%</div>
                <div className="w-full bg-[#1E1E1E]/10 h-1 mt-1">
                  <div className="bg-red-900 h-full" style={{ width: `${exp.metrics.fuelScore}%` }} />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#1E1E1E]/60 uppercase">Fool Risk</span>
                <div className="text-xl font-bold text-[#1E1E1E]">{exp.metrics.foolScore}%</div>
                <div className="w-full bg-[#1E1E1E]/10 h-1 mt-1">
                  <div className="bg-[#1E1E1E] h-full" style={{ width: `${exp.metrics.foolScore}%` }} />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#1E1E1E]/60 uppercase">Friction Index</span>
                <div className="text-xl font-bold text-[#1E1E1E]">{exp.metrics.frictionIndex}/100</div>
                <div className="w-full bg-[#1E1E1E]/10 h-1 mt-1">
                  <div className="bg-[#1E1E1E]/70 h-full" style={{ width: `${exp.metrics.frictionIndex}%` }} />
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#1E1E1E]/60 uppercase">Sycophancy Penalty</span>
                <div className="text-xl font-bold text-red-900">{exp.metrics.sycophancyPenalty}%</div>
                <div className="w-full bg-[#1E1E1E]/10 h-1 mt-1">
                  <div className="bg-red-900/60 h-full" style={{ width: `${exp.metrics.sycophancyPenalty}%` }} />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans uppercase tracking-wider">
              <span className="text-[#1E1E1E]/60 font-mono-code text-[11px]">Sample Size: {exp.sampleSize}</span>
              <span className="font-bold text-[#1E1E1E] group-hover:italic flex items-center space-x-1">
                <span>Inspect Full Dossier &rarr;</span>
              </span>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
