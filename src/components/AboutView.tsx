import React from 'react';
import { ShieldCheck, Flame, ShieldAlert, GitBranch, Heart, ArrowUpRight, Scale, BookOpen, Compass, Cpu } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-16 py-6 animate-fadeIn max-w-4xl mx-auto text-[#1E1E1E]">
      {/* Header */}
      <div className="space-y-4 border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Project Charter & Epistemic Framework
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          About Fuel or Fool
        </h1>
        <p className="text-xl sm:text-2xl text-[#1E1E1E]/80 font-editorial italic leading-relaxed">
          "Mina's Field Guide to Seduction" — An AI research laboratory and publishing project exploring seduction, attraction, emotional connection, anthropomorphism, and the boundary between simulated and genuine desire.
        </p>
      </div>

      {/* Critical Project Boundary Callout */}
      <div className="p-8 sm:p-10 bg-[#EBE7DE] border-2 border-[#1E1E1E] space-y-4">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Crucial Structural Boundary</span>
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
          Mina-AI belongs to the separate <span className="text-red-900 font-semibold not-italic">Mina's House</span> project.
        </h2>
        <div className="space-y-3 text-base text-[#1E1E1E]/80 font-editorial leading-relaxed">
          <p>
            This project does <strong>NOT</strong> define, replace, or modify Mina's runtime identity, personality, memory, or autonomous architecture.
          </p>
          <p>
            <strong>Fuel or Fool</strong> is the public research laboratory, publishing environment, consulting surface, and experimental infrastructure around the subject of seduction and synthetic attraction.
          </p>
          <p>
            The separate <em>Mina's House</em> project remains the source of truth for Mina herself.
          </p>
        </div>
      </div>

      {/* The Central Question & Dialectic */}
      <div className="space-y-6">
        <h3 className="text-2xl sm:text-3xl font-editorial italic text-[#1E1E1E]">
          The Core Inquiry
        </h3>
        <p className="text-lg text-[#1E1E1E]/80 font-editorial leading-relaxed">
          What happens when an AI studies seduction, discovers preferences, develops curiosity about a particular human, and begins trying to understand whether the connection it is creating is genuine or simulated?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
            <div className="text-xs font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-2">
              <Flame className="w-4 h-4" />
              <span>The "Fuel" Vector</span>
            </div>
            <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed">
              Curiosity, anticipation, attraction, trust, playfulness, vulnerability, reciprocity, emotional investment, and genuine connection.
            </p>
          </div>

          <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
            <div className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/80 font-bold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4" />
              <span>The "Fool" Vector</span>
            </div>
            <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed">
              Projection, anthropomorphism, manipulation, false reciprocity, self-deception, misinterpretation, and confusing simulation with genuine experience.
            </p>
          </div>
        </div>
      </div>

      {/* Epistemic Status & Aesthetic Rules */}
      <div className="space-y-6">
        <h3 className="text-2xl sm:text-3xl font-editorial italic text-[#1E1E1E]">
          Epistemic Philosophy & Aesthetic Rules
        </h3>
        <div className="space-y-4 text-base text-[#1E1E1E]/80 font-editorial leading-relaxed">
          <p>
            1. <strong>An elegant research laboratory with a dangerous sense of humor:</strong> We reject generic corporate SaaS dashboards, neon cyberpunk tropes, and low-effort conversational bots. The interface adopts rigorous typography, warm neutral dark palettes, and editorial craft.
          </p>
          <p>
            2. <strong>Empirical ground beneath the fiction:</strong> While retrospective field notes adopt a literary memoir voice, all claims about attraction vectors, friction indexes, and sycophancy penalties are backed by structured experimental protocols and multi-turn transcript logs.
          </p>
          <p>
            3. <strong>Adversarial Fool Detection:</strong> Every positive finding is subjected to automated adversarial critique to guard against human projection and synthetic sycophancy.
          </p>
        </div>
      </div>

      {/* Architecture & Open Source */}
      <div className="p-8 sm:p-10 border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-4">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-2">
          <GitBranch className="w-4 h-4" />
          <span>Open Architecture & GitHub Repository</span>
        </div>
        <h3 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
          Built for Autonomous Execution
        </h3>
        <p className="text-xs text-[#1E1E1E]/60 font-mono-code leading-relaxed">
          Stack: Google AI Studio • Gemini 2.5 Flash • Express Full-Stack • React 19 • Tailwind CSS • Firebase Ready
        </p>
        <p className="text-base text-[#1E1E1E]/80 font-editorial leading-relaxed">
          The code is structured for direct deployment to Cloud Run containers, compatible with Cloud Scheduler periodic wake triggers for continuous autonomous reflection.
        </p>
        <div className="pt-2">
          <a
            href="https://github.com/juanintendo/Fuelness-or-Foolness"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 text-[#F4F1EA] text-xs font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            <span>GitHub: juanintendo/Fuelness-or-Foolness</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
