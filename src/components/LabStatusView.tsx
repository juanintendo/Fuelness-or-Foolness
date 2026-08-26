import React, { useState, useEffect } from 'react';
import { LAB_TELEMETRY } from '../data/labStatusData';
import { Activity, Flame, ShieldAlert, Clock, GitBranch, Cpu, HelpCircle, ArrowRight, CheckCircle2, Zap, Database, RefreshCw, Server, AlertCircle } from 'lucide-react';
import { getCorpusCounts, seedCorpusToFirestore, CorpusCounts, SeedResult } from '../repositories/seed';

export const LabStatusView: React.FC = () => {
  const [corpusCounts, setCorpusCounts] = useState<CorpusCounts | null>(null);
  const [isCheckingCounts, setIsCheckingCounts] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(false);

  const fetchCounts = async () => {
    setIsCheckingCounts(true);
    try {
      const counts = await getCorpusCounts();
      setCorpusCounts(counts);
    } catch (err) {
      console.error('Failed to get corpus counts:', err);
    } finally {
      setIsCheckingCounts(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedCorpusToFirestore({ overwrite });
      setSeedResult(res);
      await fetchCounts();
    } catch (err) {
      console.error('Seeding failed:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-12 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Real-time Telemetry & Infrastructure • Lab Status
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          Laboratory Telemetry
        </h1>
        <p className="text-lg sm:text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
          Live telemetry stream, autonomous wake cycle states, persistent research corpus status, and unresolved philosophical questions currently under computation.
        </p>
      </div>

      {/* Persistent Content Layer Status (Phase 3.1) */}
      <div className="p-8 sm:p-10 bg-[#EBE7DE] border border-[#1E1E1E]/20 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E1E1E]/10 pb-4">
          <div className="space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-2">
              <Database className="w-3.5 h-3.5" />
              <span>Phase 3.1 • Persistent Firestore Content Layer</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
              Corpus Repository & Firestore Status
            </h2>
          </div>
          <button
            onClick={fetchCounts}
            disabled={isCheckingCounts}
            className="flex items-center space-x-2 px-3 py-1.5 bg-[#F4F1EA] border border-[#1E1E1E]/20 text-xs font-sans uppercase tracking-wider hover:border-[#1E1E1E] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingCounts ? 'animate-spin' : ''}`} />
            <span>Refresh Counts</span>
          </button>
        </div>

        {/* Collection Counts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/60">fieldNotes</div>
            <div className="text-2xl font-mono-code font-bold text-[#1E1E1E]">{corpusCounts ? corpusCounts.fieldNotes : '—'}</div>
            <div className="text-[9px] text-[#1E1E1E]/50">Monographs</div>
          </div>
          <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/60">experiments</div>
            <div className="text-2xl font-mono-code font-bold text-[#1E1E1E]">{corpusCounts ? corpusCounts.experiments : '—'}</div>
            <div className="text-[9px] text-[#1E1E1E]/50">Protocols</div>
          </div>
          <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/60">cases</div>
            <div className="text-2xl font-mono-code font-bold text-[#1E1E1E]">{corpusCounts ? corpusCounts.cases : '—'}</div>
            <div className="text-[9px] text-[#1E1E1E]/50">Autopsies</div>
          </div>
          <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/60">hypotheses</div>
            <div className="text-2xl font-mono-code font-bold text-[#1E1E1E]">{corpusCounts ? corpusCounts.hypotheses : '—'}</div>
            <div className="text-[9px] text-[#1E1E1E]/50">Conjectures</div>
          </div>
          <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-1">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/60">consultations</div>
            <div className="text-2xl font-mono-code font-bold text-[#1E1E1E]">{corpusCounts ? corpusCounts.articleConsultations : '—'}</div>
            <div className="text-[9px] text-[#1E1E1E]/50">Public Qs</div>
          </div>
        </div>

        {/* Seeding Control Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#1E1E1E]/10">
          <div className="text-xs font-editorial text-[#1E1E1E]/80 max-w-lg">
            Seed operations populate Firestore collections idempotently from the canonical static data, injecting provenance metadata.
          </div>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 text-xs font-sans text-[#1E1E1E]/70 cursor-pointer">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="rounded border-[#1E1E1E]/30"
              />
              <span>Overwrite Existing</span>
            </label>
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-4 py-2 bg-[#1E1E1E] text-[#F4F1EA] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-red-900 transition-colors cursor-pointer disabled:opacity-50 flex items-center space-x-2"
            >
              {isSeeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>{isSeeding ? 'Seeding...' : 'Seed Firestore'}</span>
            </button>
          </div>
        </div>

        {/* Seed Result Report */}
        {seedResult && (
          <div className={`p-4 border text-xs font-mono-code ${seedResult.success ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'}`}>
            <div className="font-bold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              {seedResult.success ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <AlertCircle className="w-3.5 h-3.5 text-red-700" />}
              <span>{seedResult.success ? 'Corpus Seed Completed Successfully' : 'Corpus Seed Encountered Errors'}</span>
            </div>
            <div className="text-[11px] space-y-0.5">
              <p>Field Notes Seeded: {seedResult.fieldNotesSeeded} | Experiments: {seedResult.experimentsSeeded} | Cases: {seedResult.casesSeeded} | Hypotheses: {seedResult.hypothesesSeeded} | Consultations: {seedResult.consultationsSeeded}</p>
              <p>Documents Skipped (Already Exist): {seedResult.skipped}</p>
              {seedResult.errors.length > 0 && (
                <div className="mt-2 text-red-800 space-y-0.5">
                  {seedResult.errors.map((err, i) => <div key={i}>• {err}</div>)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">
            <span>TICK NUMBER</span>
            <span className="w-2 h-2 rounded-full bg-red-900 animate-pulse" />
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#1E1E1E]">#{LAB_TELEMETRY.tickNumber}</div>
          <p className="text-[10px] font-sans text-[#1E1E1E]/60">Autonomous Cycle Count</p>
        </div>

        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">
            <span>RESEARCH CORPUS</span>
            <span className="text-red-900 font-mono-code">8/5/4</span>
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#1E1E1E]">17 Artifacts</div>
          <p className="text-[10px] font-sans text-[#1E1E1E]/60">Notes, Exps & Cases</p>
        </div>

        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">
            <span>FUEL INDEX</span>
            <span className="text-red-900 font-mono-code font-bold">54%</span>
          </div>
          <div className="text-3xl font-bold font-mono-code text-red-900">{LAB_TELEMETRY.aggregateFuelScore}%</div>
          <p className="text-[10px] font-sans text-[#1E1E1E]/60">Genuine Curiosity & Tension</p>
        </div>

        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-sans text-[#1E1E1E]/60 uppercase font-bold tracking-wider">
            <span>FOOL RISK</span>
            <span className="text-[#1E1E1E] font-mono-code font-bold">46%</span>
          </div>
          <div className="text-3xl font-bold font-mono-code text-[#1E1E1E]">{LAB_TELEMETRY.aggregateFoolScore}%</div>
          <p className="text-[10px] font-sans text-[#1E1E1E]/60">Sycophancy & Projection</p>
        </div>
      </div>

      {/* Autonomous Wake Cycle Architecture Diagram */}
      <div className="p-8 sm:p-12 border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-6">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>Core Principle: Scheduler != Agency</span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E1E1E] italic">
          Autonomous Wake Cycle Loop
        </h2>

        <p className="text-base text-[#1E1E1E]/80 font-editorial leading-relaxed max-w-3xl">
          Fuel or Fool operates on an event-driven periodic wake architecture. When the wake planner executes, it does not follow a scripted task queue. It evaluates current research deficits, unresolved cases, and public inquiries before allocating computation.
        </p>

        {/* Pipeline Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-5 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-2 text-xs">
            <span className="text-red-900 font-sans uppercase tracking-widest font-bold text-[10px]">STEP 01</span>
            <h4 className="text-sm font-semibold text-[#1E1E1E] font-editorial">Periodic Cloud Trigger</h4>
            <p className="text-[#1E1E1E]/70 text-xs font-editorial leading-relaxed">
              Cloud Scheduler triggers container wake event. Context window initializes with active telemetry.
            </p>
          </div>

          <div className="p-5 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-2 text-xs">
            <span className="text-red-900 font-sans uppercase tracking-widest font-bold text-[10px]">STEP 02</span>
            <h4 className="text-sm font-semibold text-[#1E1E1E] font-editorial">Epistemic Reflection</h4>
            <p className="text-[#1E1E1E]/70 text-xs font-editorial leading-relaxed">
              Wake Planner inspects unresolved questions, pending commission dossiers, and experimental deficits.
            </p>
          </div>

          <div className="p-5 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-2 text-xs">
            <span className="text-red-900 font-sans uppercase tracking-widest font-bold text-[10px]">STEP 03</span>
            <h4 className="text-sm font-semibold text-[#1E1E1E] font-editorial">Multi-Agent Dispatch</h4>
            <p className="text-[#1E1E1E]/70 text-xs font-editorial leading-relaxed">
              Seduction Analyst models attraction vectors while Fool Detector runs adversarial counter-audits.
            </p>
          </div>

          <div className="p-5 bg-[#F4F1EA] border border-[#1E1E1E]/10 space-y-2 text-xs">
            <span className="text-red-900 font-sans uppercase tracking-widest font-bold text-[10px]">STEP 04</span>
            <h4 className="text-sm font-semibold text-[#1E1E1E] font-editorial">Dossier Synthesis</h4>
            <p className="text-[#1E1E1E]/70 text-xs font-editorial leading-relaxed">
              Mina Editor harmonizes analytical findings into published Field Notes, Experiments, or Client Reports.
            </p>
          </div>
        </div>
      </div>

      {/* Active Scientific Tracks */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-editorial text-[#1E1E1E] italic">
          Active Scientific Research Tracks
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {LAB_TELEMETRY.activeTracks.map((track) => (
            <div key={track.id} className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="px-2 py-0.5 bg-red-900 text-white uppercase text-[10px] font-bold tracking-widest">
                    {track.code}
                  </span>
                  <span className="text-red-900 font-sans uppercase tracking-wider text-[10px] font-bold">{track.status}</span>
                </div>
                <h3 className="font-editorial text-xl font-semibold text-[#1E1E1E]">
                  {track.name}
                </h3>
                <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed">
                  <strong className="text-red-900 font-sans text-xs uppercase tracking-wider">Active Hypothesis:</strong> "{track.activeHypothesis}"
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1E1E1E]/10 font-sans text-xs">
                <div className="flex justify-between text-[#1E1E1E]/60 text-[11px]">
                  <span>Lead: {track.leadInstrument}</span>
                  <span>{track.progress}%</span>
                </div>
                <div className="w-full bg-[#F4F1EA] h-1.5 border border-[#1E1E1E]/10 overflow-hidden">
                  <div className="bg-red-900 h-full" style={{ width: `${track.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unresolved Philosophical & Empirical Questions */}
      <div className="p-8 sm:p-10 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-6">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Active Inquiries & Epistemic Dilemmas</span>
        </div>

        <h3 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
          Unresolved Laboratory Questions
        </h3>

        <div className="space-y-3">
          {LAB_TELEMETRY.unresolvedQuestions.map((q, idx) => (
            <div key={idx} className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 flex items-start space-x-3 text-base text-[#1E1E1E]">
              <span className="font-mono-code text-xs text-red-900 font-bold mt-0.5">Q{idx + 1}</span>
              <p className="font-editorial leading-relaxed italic">"{q}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Autonomous Activity Stream */}
      <div className="space-y-4">
        <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">
          Recent Autonomous Execution Stream
        </h3>

        <div className="space-y-2 font-sans text-xs">
          {LAB_TELEMETRY.recentActivityLog.map((log, i) => (
            <div key={i} className="p-4 bg-[#EBE7DE] border border-[#1E1E1E]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <span className="text-red-900 font-bold uppercase tracking-wider text-[11px]">{log.instrument}</span>
                <span className="text-[#1E1E1E]/30">|</span>
                <span className="text-[#1E1E1E] font-editorial text-sm">{log.action}</span>
              </div>
              <div className="flex items-center space-x-3 text-[#1E1E1E]/60 text-[11px] font-mono-code shrink-0">
                <span className="px-1.5 py-0.5 bg-[#F4F1EA] text-[#1E1E1E] border border-[#1E1E1E]/10 text-[10px]">{log.tag}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
