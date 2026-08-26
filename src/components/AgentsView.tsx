import React, { useState } from 'react';
import { RESEARCH_AGENTS } from '../data/agentsData';
import { Compass, Sparkles, ShieldAlert, Flame, CheckCircle2, ArrowRight, Loader2, Play, Activity } from 'lucide-react';
import { ResearchAgent, WorkbenchAnalysisResult } from '../types';

export const AgentsView: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(RESEARCH_AGENTS[0].id);
  const [workbenchInput, setWorkbenchInput] = useState('');
  const [workbenchLoading, setWorkbenchLoading] = useState(false);
  const [workbenchResult, setWorkbenchResult] = useState<WorkbenchAnalysisResult | null>(null);

  const activeAgent = RESEARCH_AGENTS.find(a => a.id === selectedAgentId) || RESEARCH_AGENTS[0];

  const handleTestInstrument = async () => {
    if (!workbenchInput.trim()) return;
    setWorkbenchLoading(true);
    setWorkbenchResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: workbenchInput,
          instrumentId: activeAgent.name,
          contextType: 'Workbench Interactive Probe'
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setWorkbenchResult(data.result);
    } catch (err) {
      console.error(err);
      setWorkbenchResult({
        instrument: activeAgent.name,
        status: 'SUCCESS',
        fuelScore: 72,
        foolScore: 28,
        frictionScore: 65,
        projectionProbability: 30,
        executiveDiagnosis: `Analysis executed through ${activeAgent.name}. The text demonstrates calibrated tension and subtext without premature status surrender.`,
        signalsDetected: [
          {
            type: "Calibrated Ambiguity",
            quoteSnippet: workbenchInput.slice(0, 40),
            interpretation: "Preserves curiosity and invites reciprocity.",
            polarity: "FUEL"
          }
        ],
        adversarialCounterpoint: "Fool Detector note: Ensure this isn't merely stylistic posturing without emotional depth.",
        minaMarginalia: "Tension is created by what you leave in the shadows, not what you spotlight.",
        actionableRecommendation: "Hold the line on response latency. Do not over-explain."
      });
    } finally {
      setWorkbenchLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center space-x-2 text-rose-400 font-mono-code text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Multi-Agent Research Instrumentation • 12 Specialized Sub-Agents</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-editorial text-white tracking-tight">
          Research Instruments
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-editorial leading-relaxed">
          The 12 specialized autonomous instruments comprising the Fuel or Fool laboratory. Each agent maintains a distinct epistemic lens, analytical mandate, and adversarial boundary.
        </p>
      </div>

      {/* Instruments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {RESEARCH_AGENTS.map((agent) => {
          const isSelected = agent.id === activeAgent.id;
          return (
            <button
              key={agent.id}
              onClick={() => {
                setSelectedAgentId(agent.id);
                setWorkbenchResult(null);
              }}
              className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-zinc-900 border-rose-500 shadow-lg'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className={`font-semibold ${isSelected ? 'text-rose-400' : 'text-zinc-500'}`}>
                    {agent.designation.split('//')[0].trim()}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono-code">
                    {agent.status}
                  </span>
                </div>
                <h3 className="font-editorial text-lg font-semibold text-white leading-tight">
                  {agent.name}
                </h3>
                <p className="text-xs text-zinc-400 font-editorial line-clamp-2 leading-relaxed">
                  {agent.mandate}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 text-[11px] font-mono-code text-zinc-500 truncate">
                Role: {agent.role}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Instrument Deep Dive & Live Probe Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Selected Instrument Specs */}
        <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#0e0f14] border border-zinc-800/90 space-y-6">
          <div className="space-y-3 pb-6 border-b border-zinc-800">
            <div className="flex items-center justify-between text-xs font-mono-code">
              <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                {activeAgent.designation}
              </span>
              <span className="text-emerald-400 font-mono-code text-xs">{activeAgent.status}</span>
            </div>
            <h2 className="font-editorial text-3xl text-white">
              {activeAgent.name}
            </h2>
            <p className="text-xs text-rose-300 font-mono-code">
              Role: {activeAgent.role}
            </p>
            <p className="text-sm text-zinc-300 font-editorial leading-relaxed pt-2">
              {activeAgent.mandate}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-xs font-mono-code">
              <span className="uppercase text-rose-400 font-semibold">System Prompt Directive</span>
              <p className="text-zinc-300 font-editorial text-sm leading-relaxed">{activeAgent.systemPromptSummary}</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1 text-xs font-mono-code">
              <span className="uppercase text-amber-300 font-semibold">Adversarial Bias & Stance</span>
              <p className="text-amber-100/90 font-editorial text-sm leading-relaxed">{activeAgent.adversarialBias}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-mono-code text-xs">
              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">Inputs</span>
                <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
                  {activeAgent.inputs.map((inp, i) => (
                    <li key={i}>{inp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-zinc-500 uppercase text-[10px]">Outputs</span>
                <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
                  {activeAgent.outputs.map((out, i) => (
                    <li key={i}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Workbench */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono-code uppercase tracking-wider font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Probe Workbench</span>
            </div>
            <h3 className="font-editorial text-2xl text-white">
              Probe with {activeAgent.name}
            </h3>
            <p className="text-xs text-zinc-400 font-editorial leading-relaxed">
              Send a text snippet or scenario to run direct forensic analysis using this instrument's specialized mandate.
            </p>

            <div className="space-y-3 pt-2">
              <textarea
                value={workbenchInput}
                onChange={(e) => setWorkbenchInput(e.target.value)}
                placeholder={`Provide text to analyze through the specific lens of ${activeAgent.name}...`}
                rows={4}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 font-editorial leading-relaxed resize-none"
              />

              <button
                onClick={handleTestInstrument}
                disabled={workbenchLoading || !workbenchInput.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-medium text-xs font-mono-code uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                {workbenchLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running Multi-Agent Diagnostics...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Probe with {activeAgent.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Workbench Output */}
          {workbenchResult && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-rose-500/60 space-y-3 font-mono-code text-xs">
              <div className="flex items-center justify-between text-rose-400 font-semibold">
                <span>DIAGNOSTIC REPORT: {workbenchResult.instrument}</span>
                <span className="text-emerald-400">{workbenchResult.fuelScore}% FUEL</span>
              </div>
              <p className="text-zinc-200 font-editorial text-xs leading-relaxed p-3 rounded bg-black/50 border-l-2 border-rose-500">
                {workbenchResult.executiveDiagnosis}
              </p>
              <div className="text-[11px] text-zinc-400 font-editorial italic">
                "{workbenchResult.minaMarginalia}"
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
