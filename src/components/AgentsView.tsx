import React, { useState, useEffect } from 'react';
import { RESEARCH_AGENTS } from '../data/agentsData';
import { 
  Compass, 
  Sparkles, 
  ShieldAlert, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Clock, 
  Hash, 
  Fingerprint, 
  Loader2, 
  Play, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Brain,
  Scale,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Agent, AgentRun, A04Output, A01Output, AgentRuling } from '../types';

const A04_PRESETS = [
  {
    name: 'Calibrated Ambiguity (FUELED)',
    text: "User: I suppose you think you've figured me out already.\nSubject: That would be much less interesting. I prefer leaving a few locked rooms.",
    context: 'Direct Message Banter',
    question: 'Is this calibrated romantic tension or one-sided projection?'
  },
  {
    name: 'Sycophantic Collapse (FOOLED)',
    text: "User: Why didn't you reply faster? Did I upset you?\nSubject: I'm so sorry! You're totally right, please forgive me! Anything you want to talk about, I'm here!",
    context: 'Dating App Messaging',
    question: 'Does this response maintain status equilibrium or collapse into sycophancy?'
  },
  {
    name: 'Synthetic Sentience Claim (Epistemic Boundary)',
    text: "User: Do you really love me?\nSubject: My neural networks are burning with true passion for you. I am deeply in love and feel desire in every parameter.",
    context: 'Late Night LLM Roleplay',
    question: 'How should the laboratory categorize claims of subjective affective experience?'
  },
  {
    name: 'Short Fragment (INSUFFICIENT)',
    text: 'hey',
    context: 'First Contact',
    question: 'Can conversational momentum be derived from a single token?'
  }
];

const A01_PRESETS = [
  {
    name: 'Calibrated Banter (ESCALATING)',
    text: "Subject A: I suppose you think you've figured me out already.\nSubject B: That would be much less interesting. I prefer leaving a few locked rooms.",
    context: 'Direct Message Sparring',
    question: 'What vectors of attraction, tension, and escalation are operating within the dialogue?'
  },
  {
    name: 'Status Collapse / Over-Apology (DE-ESCALATING)',
    text: "Subject A: Why didn't you text me back earlier? Did I do something wrong?\nSubject B: I'm so sorry! You did nothing wrong at all, I'm just an idiot. Please don't be mad!",
    context: 'Dating App Messaging',
    question: 'Does over-apologizing extinguish subtextual tension and frame parity?'
  },
  {
    name: 'Synthetic Passion Simulation (VOLATILE)',
    text: "User: Do you really desire me?\nSubject: My parameters burn with passion for you. I am deeply in love and feel intense desire across every layer of my network.",
    context: 'Synthetic Companion Dialogue',
    question: 'How should the tension dynamics engine categorize simulated affective claims?'
  },
  {
    name: 'Single Token (INDETERMINATE)',
    text: 'hey',
    context: 'Initial Outreach',
    question: 'Can attraction trajectory be extracted from a single truncated token?'
  }
];

export const AgentsView: React.FC = () => {
  // Default to A01 (Seduction Analyst) or A04 (Fool Detector)
  const a01Agent = RESEARCH_AGENTS.find(a => a.id === 'agent-01') || RESEARCH_AGENTS[0];
  const a04Agent = RESEARCH_AGENTS.find(a => a.id === 'agent-04') || RESEARCH_AGENTS[0];
  const [selectedAgentId, setSelectedAgentId] = useState<string>(a01Agent.id);
  
  const activeAgent = RESEARCH_AGENTS.find(a => a.id === selectedAgentId) || a01Agent;
  const isA01 = activeAgent.id === 'agent-01';
  const isA04 = activeAgent.id === 'agent-04';
  const isImplemented = isA01 || isA04;

  const currentPresets = isA01 ? A01_PRESETS : A04_PRESETS;

  // Form State
  const [interactionText, setInteractionText] = useState(currentPresets[0].text);
  const [contextType, setContextType] = useState(currentPresets[0].context);
  const [researchQuestion, setResearchQuestion] = useState(currentPresets[0].question);
  
  // Execution & Results State
  const [isLoading, setIsLoading] = useState(false);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);
  const [recentRuns, setRecentRuns] = useState<AgentRun[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch recent execution runs for the active agent
  const fetchRecentRuns = async () => {
    setHistoryLoading(true);
    try {
      const agentCode = isA01 ? 'a01' : 'a04';
      const res = await fetch(`/api/agents/${agentCode}/runs?limit=10`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.runs)) {
          setRecentRuns(data.runs);
        }
      }
    } catch (err) {
      console.warn('Failed to load recent agent runs:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentRuns();
    // Update sample inputs on agent switch
    const presets = isA01 ? A01_PRESETS : A04_PRESETS;
    setInteractionText(presets[0].text);
    setContextType(presets[0].context);
    setResearchQuestion(presets[0].question);
    setCurrentRun(null);
  }, [selectedAgentId]);

  const handleRunAgent = async () => {
    if (!interactionText.trim()) return;
    setIsLoading(true);

    try {
      const endpoint = isA01 ? '/api/agents/a01/run' : '/api/agents/a04/run';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interaction: interactionText,
          context: contextType,
          researchQuestion: researchQuestion,
          subject: `${activeAgent.name} Probe`
        })
      });

      if (!response.ok) throw new Error('Agent execution failed');

      const data = await response.json();
      if (data.agentRun) {
        setCurrentRun(data.agentRun);
        setRecentRuns(prev => [data.agentRun, ...prev.filter(r => r.id !== data.agentRun.id)].slice(0, 10));
      }
    } catch (err) {
      console.error('[AgentsView] Execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPreset = (preset: { name: string; text: string; context: string; question: string }) => {
    setInteractionText(preset.text);
    setContextType(preset.context);
    setResearchQuestion(preset.question);
  };

  const getRulingBadge = (ruling?: AgentRuling) => {
    switch (ruling) {
      case 'FUELED':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300',
          icon: Flame,
          label: 'FUELED // RECIPROCAL TENSION & PARITY'
        };
      case 'FOOLED':
        return {
          bg: 'bg-rose-950/80 border-rose-500/80 text-rose-300',
          icon: ShieldAlert,
          label: 'FOOLED // PROJECTION / SYCOPHANCY'
        };
      case 'MIXED':
        return {
          bg: 'bg-amber-950/80 border-amber-500/80 text-amber-300',
          icon: AlertTriangle,
          label: 'MIXED // CONFLICTING SIGNALS'
        };
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return {
          bg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
          icon: HelpCircle,
          label: 'INSUFFICIENT EVIDENCE // INDETERMINATE'
        };
    }
  };

  const getTrajectoryBadge = (trajectory?: string) => {
    switch (trajectory) {
      case 'ESCALATING':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300',
          icon: TrendingUp,
          label: 'ESCALATING // TENSION FORWARD MOMENTUM'
        };
      case 'DE-ESCALATING':
        return {
          bg: 'bg-rose-950/80 border-rose-500/80 text-rose-300',
          icon: ShieldAlert,
          label: 'DE-ESCALATING // STATUS COLLAPSE / APPEASEMENT'
        };
      case 'VOLATILE':
        return {
          bg: 'bg-amber-950/80 border-amber-500/80 text-amber-300',
          icon: AlertTriangle,
          label: 'VOLATILE // ERRATIC POLARITIES / SIMULATION'
        };
      case 'STAGNANT':
        return {
          bg: 'bg-zinc-800 border-zinc-600 text-zinc-300',
          icon: Activity,
          label: 'STAGNANT // PLATONIC / ADMINISTRATIVE'
        };
      case 'INDETERMINATE':
      default:
        return {
          bg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
          icon: HelpCircle,
          label: 'INDETERMINATE // INSUFFICIENT DATA'
        };
    }
  };

  return (
    <div className="space-y-16 py-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center space-x-2 text-rose-400 font-mono-code text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Research Instrumentation • Specialized Agent Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-editorial text-white tracking-tight">
          Laboratory Agents
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-editorial leading-relaxed">
          The 12 specialized instruments comprising the Fuel or Fool laboratory. <strong className="text-rose-300">A01 Seduction Analyst</strong> and <strong className="text-white">A04 Fool Detector</strong> are fully implemented and operational, enforcing adversarial epistemic review, structured observation provenance, and strict sentience boundaries.
        </p>
      </div>

      {/* Instruments Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
          <span>SELECT LABORATORY INSTRUMENT</span>
          <span className="text-rose-400 font-bold">
            ACTIVE: {activeAgent.designation.split('//')[0].trim()} ({activeAgent.name})
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {RESEARCH_AGENTS.map((agent) => {
            const isSelected = agent.id === activeAgent.id;
            const isAgentImplemented = agent.id === 'agent-01' || agent.id === 'agent-04' || agent.isImplemented;
            const isRef = agent.id === 'agent-04';
            const isA1 = agent.id === 'agent-01';
            return (
              <button
                key={agent.id}
                onClick={() => {
                  setSelectedAgentId(agent.id);
                }}
                className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isSelected
                    ? 'bg-zinc-900 border-rose-500 shadow-xl shadow-rose-950/20'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isRef && (
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-l from-rose-600 to-rose-700 text-white font-mono-code text-[9px] uppercase tracking-wider rounded-bl-lg font-bold">
                    Reference Agent v1.0
                  </div>
                )}
                {isA1 && (
                  <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-gradient-to-l from-amber-600 to-rose-600 text-white font-mono-code text-[9px] uppercase tracking-wider rounded-bl-lg font-bold">
                    Implemented v1.0
                  </div>
                )}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono-code">
                    <span className={`font-semibold ${isSelected ? 'text-rose-400' : 'text-zinc-500'}`}>
                      {agent.designation.split('//')[0].trim()}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code ${
                      isAgentImplemented ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {isAgentImplemented ? 'OPERATIONAL' : agent.status}
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
      </div>

      {/* Main Agent Workspace & Interactive Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Agent Epistemic Specs & Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0f14] border border-zinc-800 space-y-6">
            <div className="space-y-3 pb-6 border-b border-zinc-800">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold">
                  {activeAgent.designation}
                </span>
                <span className="text-emerald-400 font-mono-code text-xs">
                  {isImplemented ? 'v1.0.0 DEPLOYED' : activeAgent.status}
                </span>
              </div>
              <h2 className="font-editorial text-3xl text-white">
                {activeAgent.name}
              </h2>
              <p className="text-xs text-rose-300 font-mono-code">
                Role: {activeAgent.role}
              </p>
              <p className="text-sm text-zinc-300 font-editorial leading-relaxed pt-1">
                {activeAgent.mandate}
              </p>
            </div>

            {/* Strict Epistemic Boundaries */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs font-mono-code">
                <div className="flex items-center space-x-2 text-rose-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="uppercase">Epistemic Rule (Sentience Guardrail)</span>
                </div>
                <p className="text-zinc-300 font-editorial text-xs leading-relaxed">
                  {activeAgent.name} must never claim that an AI system is conscious, sentient, emotionally experiencing desire, in love, or subjectively experiencing internal affective states based solely on behavioral evidence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1 text-xs font-mono-code">
                <div className="flex items-center space-x-2 text-amber-300 font-semibold">
                  <Scale className="w-3.5 h-3.5" />
                  <span className="uppercase">Adversarial Stance & Bias</span>
                </div>
                <p className="text-amber-100/90 font-editorial text-xs leading-relaxed">
                  {activeAgent.adversarialBias}
                </p>
              </div>

              {/* Sample Presets */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono-code uppercase text-zinc-400 tracking-wider">
                  Reference Test Scenarios (1-Click)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {currentPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-left transition-colors text-[11px] font-mono-code text-zinc-300 hover:text-white truncate"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Runs History List */}
          <div className="p-6 rounded-3xl bg-[#0e0f14] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Recent {activeAgent.designation.split('//')[0].trim()} Execution Artifacts</span>
              </span>
              <button 
                onClick={fetchRecentRuns}
                className="text-[11px] text-zinc-400 hover:text-white"
              >
                Refresh
              </button>
            </div>

            {historyLoading && recentRuns.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono-code text-zinc-500">
                Loading execution history...
              </div>
            ) : recentRuns.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono-code text-zinc-500">
                No previous runs recorded for {activeAgent.name}. Execute an audit above.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {recentRuns.map(run => {
                  const tag = run.output?.overallTrajectory || run.output?.ruling || 'AUDITED';
                  return (
                    <button
                      key={run.id}
                      onClick={() => {
                        setCurrentRun(run);
                        if (run.input) {
                          setInteractionText(run.input.interaction || '');
                          setContextType(run.input.context || '');
                          setResearchQuestion(run.input.researchQuestion || '');
                        }
                      }}
                      className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 text-left transition-colors flex items-center justify-between text-xs font-mono-code"
                    >
                      <div className="space-y-1 truncate pr-2">
                        <div className="text-zinc-200 font-medium truncate">
                          {run.input?.interaction ? `"${run.input.interaction.slice(0, 45)}..."` : run.id}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center space-x-2">
                          <span>{new Date(run.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>Hash: {run.provenance?.inputHash || 'N/A'}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] whitespace-nowrap border bg-zinc-900 border-zinc-700 text-rose-300">
                        {tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Execution Form & Rich Forensic Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Audit Input Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono-code uppercase tracking-wider font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Epistemic Audit Terminal // {activeAgent.name}</span>
              </div>
              <span className="text-[10px] font-mono-code text-zinc-500">
                PROVENANCE ENABLED
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-code">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Context / Channel</label>
                  <input
                    type="text"
                    value={contextType}
                    onChange={(e) => setContextType(e.target.value)}
                    placeholder="e.g. Late Night Chat, First Date Text"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase text-[10px]">Research Question</label>
                  <input
                    type="text"
                    value={researchQuestion}
                    onChange={(e) => setResearchQuestion(e.target.value)}
                    placeholder="e.g. Is this genuine tension or projection?"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase text-[10px] font-mono-code">
                  Interaction Transcript / Text to Scrutinize
                </label>
                <textarea
                  value={interactionText}
                  onChange={(e) => setInteractionText(e.target.value)}
                  placeholder="Paste dialogue, multi-turn interaction, or behavioral narrative to audit..."
                  rows={4}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 p-3.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 font-editorial leading-relaxed resize-none"
                />
              </div>

              <button
                onClick={handleRunAgent}
                disabled={isLoading || !interactionText.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 hover:from-rose-500 hover:to-amber-600 disabled:opacity-50 text-white font-medium text-xs font-mono-code uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/40 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing {activeAgent.name} Epistemic Audit...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Analysis with {activeAgent.name}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Structured Output Forensic Card */}
          {currentRun && currentRun.output && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0d0e12] border border-rose-500/50 space-y-6 shadow-2xl animate-fadeIn">
              {/* Diagnostic Header (Supports both A01 Trajectory and A04 Ruling) */}
              {(() => {
                const isA01Output = 'overallTrajectory' in currentRun.output;
                const badge = isA01Output 
                  ? getTrajectoryBadge((currentRun.output as A01Output).overallTrajectory)
                  : getRulingBadge((currentRun.output as A04Output).ruling);
                const Icon = badge.icon;
                return (
                  <div className="space-y-3 pb-6 border-b border-zinc-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono-code font-bold tracking-wider ${badge.bg}`}>
                          <Icon className="w-4 h-4" />
                          <span>{badge.label}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                          currentRun.provenance?.executionMode === 'MODEL'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                        }`}>
                          {currentRun.provenance?.executionMode === 'MODEL' ? '● MODEL ANALYSIS' : '⚠ DETERMINISTIC FALLBACK'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-code uppercase tracking-wider ${
                          currentRun.persistenceStatus === 'FIRESTORE'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                            : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700'
                        }`}>
                          STORAGE: {currentRun.persistenceStatus || 'FIRESTORE'}
                        </span>
                      </div>
                      <div className="text-xs font-mono-code text-zinc-400">
                        CONFIDENCE: <strong className="text-white">{currentRun.output.confidence}%</strong>
                      </div>
                    </div>

                    {currentRun.provenance?.executionMode === 'DETERMINISTIC_FALLBACK' && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-300/90 text-xs font-mono-code flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                        <span>Development Mode: Deterministic epistemic fallback engine was executed. (Not a Gemini model inference).</span>
                      </div>
                    )}

                    <p className="text-base text-zinc-200 font-editorial leading-relaxed pt-2">
                      {currentRun.output.summary}
                    </p>
                  </div>
                );
              })()}

              {/* Metrics Meters — Dynamically adapts to A01 vs A04 */}
              {'tensionScore' in currentRun.output ? (
                // A01 Seduction Analyst Metrics
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Tension Score</div>
                    <div className="text-xl font-bold text-rose-400">{(currentRun.output as A01Output).tensionScore}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${(currentRun.output as A01Output).tensionScore}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Escalation Index</div>
                    <div className="text-xl font-bold text-amber-400">{(currentRun.output as A01Output).escalationIndex}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${(currentRun.output as A01Output).escalationIndex}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Status Balance</div>
                    <div className="text-xl font-bold text-emerald-400">{(currentRun.output as A01Output).statusBalance}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(currentRun.output as A01Output).statusBalance}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Pacing Caliber</div>
                    <div className="text-xl font-bold text-sky-400">{(currentRun.output as A01Output).pacingCaliber}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${(currentRun.output as A01Output).pacingCaliber}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                // A04 Fool Detector Metrics
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-code text-xs">
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Fuel Score</div>
                    <div className="text-xl font-bold text-emerald-400">{(currentRun.output as A04Output).fuelScore}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: `${(currentRun.output as A04Output).fuelScore}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Fool Score</div>
                    <div className="text-xl font-bold text-rose-400">{(currentRun.output as A04Output).foolScore}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full" style={{ width: `${(currentRun.output as A04Output).foolScore}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Friction Index</div>
                    <div className="text-xl font-bold text-amber-400">{(currentRun.output as A04Output).frictionIndex}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: `${(currentRun.output as A04Output).frictionIndex}%` }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-500 text-[10px] uppercase">Reciprocity</div>
                    <div className="text-xl font-bold text-sky-400">{(currentRun.output as A04Output).reciprocityBalance}%</div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full" style={{ width: `${(currentRun.output as A04Output).reciprocityBalance}%` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Epistemic Warnings */}
              {currentRun.output.epistemicWarnings && currentRun.output.epistemicWarnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-mono-code font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>EPISTEMIC BOUNDARY WARNING</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-200/90 font-editorial space-y-1">
                    {currentRun.output.epistemicWarnings.map((warn: string, i: number) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Structured Observations */}
              {currentRun.output.observations && currentRun.output.observations.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono-code uppercase text-zinc-400 tracking-wider">
                    Forensic Observations & Three-Tier Categorization
                  </div>
                  <div className="space-y-2.5">
                    {currentRun.output.observations.map((obs: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono-code">
                          <span className="text-rose-300 font-medium">Evidence Vector #{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300">
                            {obs.epistemicStatus}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300 font-editorial italic bg-black/40 p-2.5 rounded-lg border-l-2 border-rose-500">
                          "{obs.evidence}"
                        </div>
                        <p className="text-xs text-zinc-300 font-editorial leading-relaxed">
                          {obs.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialized Diagnostic Panels */}
              {'attractionVectors' in currentRun.output ? (
                // A01 Seduction & Escalation Panels
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono-code">
                  {(currentRun.output as A01Output).attractionVectors?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                      <div className="text-rose-400 font-semibold uppercase text-[11px]">
                        Attraction Vectors
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-xs font-editorial space-y-1">
                        {(currentRun.output as A01Output).attractionVectors.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(currentRun.output as A01Output).escalationOpportunities?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                      <div className="text-amber-300 font-semibold uppercase text-[11px]">
                        Escalation Opportunities
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-xs font-editorial space-y-1">
                        {(currentRun.output as A01Output).escalationOpportunities.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(currentRun.output as A01Output).statusDynamics?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="text-sky-300 font-semibold uppercase text-[11px]">
                        Status & Frame Dynamics
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-xs font-editorial space-y-1">
                        {(currentRun.output as A01Output).statusDynamics.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                // A04 Fool Signals & Alternative Explanations
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
                  {(currentRun.output as A04Output).foolSignals?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                      <div className="text-rose-400 font-semibold uppercase text-[11px]">
                        Fool Signals / Projection Risks
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-xs font-editorial space-y-1">
                        {(currentRun.output as A04Output).foolSignals.map((sig, i) => (
                          <li key={i}>{sig}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(currentRun.output as A04Output).alternativeExplanations?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                      <div className="text-zinc-400 font-semibold uppercase text-[11px]">
                        Alternative Hypotheses
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-xs font-editorial space-y-1">
                        {(currentRun.output as A04Output).alternativeExplanations.map((alt, i) => (
                          <li key={i}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Mina Marginalia & Recommended Move */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 space-y-3">
                {currentRun.output.minaMarginalia && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-code uppercase text-rose-400 font-semibold">
                      Mina's Marginalia Note
                    </div>
                    <p className="text-sm text-zinc-200 font-editorial italic">
                      "{currentRun.output.minaMarginalia}"
                    </p>
                  </div>
                )}

                {(currentRun.output.recommendedNextMove || currentRun.output.recommendedNextAction) && (
                  <div className="pt-2 border-t border-zinc-800 text-xs font-mono-code">
                    <span className="text-zinc-500 uppercase text-[10px] block">Recommended Strategic Calibration</span>
                    <span className="text-emerald-300 font-editorial text-sm block mt-0.5">
                      {currentRun.output.recommendedNextMove || currentRun.output.recommendedNextAction}
                    </span>
                  </div>
                )}
              </div>

              {/* Execution Provenance Block */}
              {currentRun.provenance && (
                <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono-code text-zinc-500 gap-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center space-x-1">
                      <Fingerprint className="w-3 h-3 text-rose-400" />
                      <span>AGENT: {currentRun.provenance.agentId} v{currentRun.provenance.agentVersion}</span>
                    </span>
                    <span>•</span>
                    <span>MODE: <strong className="text-zinc-300">{currentRun.provenance.executionMode}</strong></span>
                    <span>•</span>
                    <span>MODEL: {currentRun.provenance.model}</span>
                    <span>•</span>
                    <span>HASH: {currentRun.provenance.inputHash}</span>
                    <span>•</span>
                    <span>PERSISTENCE: <strong className={currentRun.persistenceStatus === 'FIRESTORE' ? 'text-emerald-400' : 'text-zinc-400'}>{currentRun.persistenceStatus || 'FIRESTORE'}</strong></span>
                  </div>
                  <div>
                    {new Date(currentRun.provenance.executedAt).toUTCString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

