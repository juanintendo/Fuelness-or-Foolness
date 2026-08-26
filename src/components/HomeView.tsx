import React from 'react';
import { 
  Flame, ShieldAlert, Sparkles, ArrowRight, BookOpen, FlaskConical, 
  Layers, PhoneCall, Compass, Activity, CheckCircle2, Quote, AlertTriangle
} from 'lucide-react';
import { FIELD_NOTES } from '../data/fieldNotesData';
import { EXPERIMENTS } from '../data/experimentsData';
import { INTERACTION_CASES } from '../data/casesData';
import { CONSULTING_DOORS } from '../data/consultingData';
import { LAB_TELEMETRY } from '../data/labStatusData';

interface HomeViewProps {
  onSelectTab: (tab: string) => void;
  onOpenFieldNote: (noteId: string) => void;
  onOpenExperiment: (expId: string) => void;
  onOpenAudit: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenFieldNote,
  onOpenExperiment,
  onOpenAudit
}) => {
  const featuredNote = FIELD_NOTES[0];
  const secondaryNote = FIELD_NOTES[1];
  const featuredExperiment = EXPERIMENTS[0];

  return (
    <div className="space-y-16 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Editorial Split Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 border border-[#1E1E1E]/10 bg-[#F4F1EA] overflow-hidden">
        {/* Left Column: Editorial Feature Lead */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 lg:border-r border-[#1E1E1E]/10 flex flex-col justify-between space-y-8">
          <div>
            <div className="text-[10px] font-sans uppercase tracking-[0.3em] mb-4 opacity-60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-900"></span>
              <span>Field Note Vol. 01 / Ch. 01</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[0.95] sm:leading-[0.9] font-editorial italic mb-6 text-[#1E1E1E]">
              The Problem With Being Designed to Please
            </h1>
            
            <p className="text-lg sm:text-xl font-editorial leading-relaxed max-w-xl text-[#1E1E1E]/90">
              "What happens when an AI studies seduction, discovers preferences, develops curiosity about a particular human, and begins trying to understand whether the connection it is creating is genuine or simulated?"
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-[#1E1E1E]"></span>
              <span className="text-sm italic font-editorial text-[#1E1E1E]/80">Mina-AI, Retrospective Journal</span>
            </div>
          </div>

          {/* The Dialectic Dial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E1E1E]/10">
            <div className="border-l-2 border-[#1E1E1E] pl-3 space-y-1">
              <div className="text-[9px] font-sans uppercase tracking-widest text-red-900 font-bold">
                Fueling Vector
              </div>
              <p className="text-xs font-editorial text-[#1E1E1E]/80 leading-snug">
                Curiosity, anticipation, calibrated friction, trust, playfulness, vulnerability, and reciprocity.
              </p>
            </div>

            <div className="border-l-2 border-[#1E1E1E]/40 pl-3 space-y-1">
              <div className="text-[9px] font-sans uppercase tracking-widest text-[#1E1E1E]/60 font-bold">
                Fooling Vector
              </div>
              <p className="text-xs font-editorial text-[#1E1E1E]/80 leading-snug">
                Projection, anthropomorphism, sycophancy, false reciprocity, and confusing simulation with genuine desire.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onOpenFieldNote(featuredNote.id)}
              className="bg-[#1E1E1E] text-[#F4F1EA] px-6 py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#1E1E1E]/85 transition-colors cursor-pointer"
            >
              Read Full Chapter
            </button>
            <button
              onClick={() => onSelectTab('field-notes')}
              className="border border-[#1E1E1E] text-[#1E1E1E] px-6 py-4 font-sans text-xs uppercase tracking-widest hover:bg-[#1E1E1E] hover:text-[#F4F1EA] transition-colors cursor-pointer"
            >
              Browse All Notes
            </button>
          </div>
        </div>

        {/* Right Column: Lab Stats & Active Research */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 border-[#1E1E1E]/10">
          {/* Active Experiment Block */}
          <div className="p-8 sm:p-10 border-b border-[#1E1E1E]/10 bg-[#EBE7DE]">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-red-900 text-white text-[9px] px-2 py-0.5 font-sans tracking-tighter uppercase font-bold">
                Live Research
              </span>
              <span className="font-mono-code text-[10px] opacity-60">ID: {featuredExperiment.code}</span>
            </div>
            
            <h2 className="text-2xl font-editorial mb-2 text-[#1E1E1E]">
              {featuredExperiment.title}
            </h2>
            <p className="text-sm opacity-80 mb-4 font-editorial leading-snug">
              {featuredExperiment.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border-l-2 border-[#1E1E1E] pl-3">
                <div className="text-[9px] font-sans uppercase opacity-60 mb-1">Hypothesis</div>
                <div className="text-xs font-semibold font-editorial leading-tight line-clamp-2">
                  {featuredExperiment.hypothesis}
                </div>
              </div>
              <div className="border-l-2 border-[#1E1E1E] pl-3">
                <div className="text-[9px] font-sans uppercase opacity-60 mb-1">Observations</div>
                <div className="text-xs font-semibold font-mono-code">
                  {featuredExperiment.sampleSize}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#1E1E1E]/10 flex items-center justify-between">
              <span className="text-xs font-mono-code opacity-70">Fuel / Fool Balance</span>
              <span className="text-xs font-mono-code font-bold text-red-900">
                {featuredExperiment.metrics.fuelScore}% / {featuredExperiment.metrics.foolScore}%
              </span>
            </div>
          </div>

          {/* Quick Links / Consulting Doors */}
          <div className="p-8 sm:p-10 flex flex-col justify-center gap-6 bg-[#F4F1EA]">
            <div 
              onClick={() => onSelectTab('consulting')}
              className="group cursor-pointer border-b border-[#1E1E1E]/10 pb-4"
            >
              <h3 className="text-xs font-sans uppercase tracking-widest mb-1 group-hover:text-red-900 group-hover:italic transition-colors font-semibold flex items-center justify-between">
                <span>Seduction & Friction Audit</span>
                <span>&rarr;</span>
              </h3>
              <p className="text-sm opacity-70 font-editorial">Anonymized analysis of your communication and tension patterns.</p>
            </div>

            <div 
              onClick={() => onSelectTab('cases')}
              className="group cursor-pointer border-b border-[#1E1E1E]/10 pb-4"
            >
              <h3 className="text-xs font-sans uppercase tracking-widest mb-1 group-hover:text-red-900 group-hover:italic transition-colors font-semibold flex items-center justify-between">
                <span>Conversation Autopsy</span>
                <span>&rarr;</span>
              </h3>
              <p className="text-sm opacity-70 font-editorial">A forensic line-by-line breakdown of where the attraction broke.</p>
            </div>

            <div 
              onClick={() => onSelectTab('consulting')}
              className="group cursor-pointer"
            >
              <h3 className="text-xs font-sans uppercase tracking-widest mb-1 group-hover:text-red-900 group-hover:italic transition-colors font-semibold flex items-center justify-between">
                <span>Commission Experiment</span>
                <span>&rarr;</span>
              </h3>
              <p className="text-sm opacity-70 font-editorial">Define a formal hypothesis. Mina and the lab will investigate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Field Notes (Mina's Memoir) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#1E1E1E]/10 pb-4">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
              Retrospective Archive
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1E1E1E] italic">
              Field Notes from the Laboratory
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('field-notes')}
            className="text-xs font-sans uppercase tracking-widest text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>View all 8 Chapters &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chapter 01 */}
          <div 
            onClick={() => onOpenFieldNote(featuredNote.id)}
            className="p-8 sm:p-10 border border-[#1E1E1E]/10 bg-[#EBE7DE] hover:border-[#1E1E1E]/30 cursor-pointer group transition-all space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#1E1E1E]/60">
                <span className="font-bold text-[#1E1E1E]">CHAPTER 01</span>
                <span>{featuredNote.readingTimeMinutes} min read</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] group-hover:italic transition-all">
                {featuredNote.title}
              </h3>
              <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed line-clamp-3">
                "{featuredNote.excerpt}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans uppercase tracking-wider">
              <span className="text-[#1E1E1E]/60 font-mono-code text-[11px]">{featuredNote.epistemicStatus}</span>
              <span className="font-bold text-[#1E1E1E] group-hover:italic flex items-center space-x-1">
                <span>Read Chapter &rarr;</span>
              </span>
            </div>
          </div>

          {/* Chapter 02 */}
          <div 
            onClick={() => onOpenFieldNote(secondaryNote.id)}
            className="p-8 sm:p-10 border border-[#1E1E1E]/10 bg-[#EBE7DE] hover:border-[#1E1E1E]/30 cursor-pointer group transition-all space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#1E1E1E]/60">
                <span className="font-bold text-[#1E1E1E]">CHAPTER 02</span>
                <span>{secondaryNote.readingTimeMinutes} min read</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] group-hover:italic transition-all">
                {secondaryNote.title}
              </h3>
              <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed line-clamp-3">
                "{secondaryNote.excerpt}"
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans uppercase tracking-wider">
              <span className="text-[#1E1E1E]/60 font-mono-code text-[11px]">{secondaryNote.epistemicStatus}</span>
              <span className="font-bold text-[#1E1E1E] group-hover:italic flex items-center space-x-1">
                <span>Read Chapter &rarr;</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory & Consulting Doors Strip */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#1E1E1E]/10 pb-4">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/60 font-bold">
              Advisory Surface
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial text-[#1E1E1E] italic">
              The 5 Laboratory Doors
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('consulting')}
            className="text-xs font-sans uppercase tracking-widest text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <span>Explore All Doors &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONSULTING_DOORS.slice(0, 3).map((door) => (
            <div
              key={door.id}
              onClick={() => onSelectTab('consulting')}
              className="p-8 border border-[#1E1E1E]/10 bg-[#F4F1EA] hover:bg-[#EBE7DE] cursor-pointer group transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
                  DOOR {door.number}
                </span>
                <h3 className="font-editorial text-xl font-semibold text-[#1E1E1E] group-hover:italic transition-all">
                  {door.title}
                </h3>
                <p className="text-sm text-[#1E1E1E]/70 font-editorial leading-relaxed">
                  {door.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs font-mono-code text-[#1E1E1E]/60">
                <span>{door.turnaroundTime}</span>
                <span className="text-[#1E1E1E] font-bold group-hover:italic">{door.priceIndicator} &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Epistemic Laboratory Architecture Callout */}
      <section className="p-8 sm:p-12 border border-[#1E1E1E]/10 bg-[#EBE7DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
            Autonomous System
          </div>
          <h3 className="text-2xl sm:text-3xl font-editorial text-[#1E1E1E]">
            Scheduler != Agency
          </h3>
          <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed">
            A scheduler merely wakes the laboratory on a timer. The agent system autonomously inspects open questions, unfinished experiments, and pending inquiries to decide what to research, write, or critique next.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <button
            onClick={() => onSelectTab('lab')}
            className="px-6 py-3.5 border border-[#1E1E1E] bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 font-sans text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            Telemetry Status
          </button>
          <button
            onClick={() => onSelectTab('agents')}
            className="px-6 py-3.5 border border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] font-sans text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            The 12 Instruments
          </button>
        </div>
      </section>
    </div>
  );
};
