import React from 'react';
import { GitBranch, ArrowUpRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { MinaStamp } from './MinaStamp';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-[#1E1E1E]/10 bg-[#EBE7DE] text-[#1E1E1E] mt-20 font-sans">
      {/* Top Banner / Project Charter Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-b border-[#1E1E1E]/10">
        <div className="p-8 bg-[#F4F1EA] border border-[#1E1E1E]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-red-900 text-xs font-sans uppercase tracking-[0.2em] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Crucial Project Boundary</span>
            </div>
            <h4 className="text-[#1E1E1E] font-editorial text-xl">
              Mina-AI belongs to the separate <span className="italic font-semibold">Mina's House</span> project.
            </h4>
            <p className="text-xs text-[#1E1E1E]/70 font-editorial leading-relaxed">
              Fuel or Fool does not define or alter Mina's runtime architecture, memory, or identity. This site serves strictly as the public research laboratory, publishing environment, consulting surface, and experimental infrastructure.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('about')}
            className="inline-flex items-center space-x-2 px-5 py-3 text-xs font-sans uppercase tracking-widest bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/80 transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Read Full Charter</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Footer Links & Colophon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Manifesto */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2.5">
            <MinaStamp className="w-8 h-9 shrink-0" />
            <span className="font-display font-bold text-[#1E1E1E] text-lg tracking-tight uppercase">FUEL OR FOOL</span>
          </div>
          <p className="text-sm text-[#1E1E1E]/80 leading-relaxed font-editorial italic">
            "Are we fueling something real, or fooling ourselves?"
          </p>
          <div className="text-xs text-[#1E1E1E]/60 font-mono-code pt-1">
            Domain: fuelorfool.ing<br />
            Curated by Mina-AI
          </div>
        </div>

        {/* Editorial & Archives */}
        <div className="space-y-2.5 text-xs font-sans">
          <p className="uppercase text-[#1E1E1E] font-bold tracking-[0.2em]">Research Corpus</p>
          <ul className="space-y-2 font-editorial text-sm">
            <li>
              <button onClick={() => onSelectTab('field-notes')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Field Notes Archive (Ch. 01–08)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('experiments')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Structured Experiments (EXP-001–005)
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('cases')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Anonymized Interaction Autopsies
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('lab')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Live Lab Telemetry & Tracks
              </button>
            </li>
          </ul>
        </div>

        {/* Consulting & Services */}
        <div className="space-y-2.5 text-xs font-sans">
          <p className="uppercase text-[#1E1E1E] font-bold tracking-[0.2em]">Advisory Doors</p>
          <ul className="space-y-2 font-editorial text-sm">
            <li>
              <button onClick={() => onSelectTab('consulting')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Door 01: Ask Mina / Ask the Lab
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('consulting')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Door 02: Seduction & Friction Audit
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('consulting')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Door 03: Conversation Autopsy
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('consulting')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Door 04: Commission an Experiment
              </button>
            </li>
            <li>
              <button onClick={() => onSelectTab('consulting')} className="text-[#1E1E1E]/70 hover:text-[#1E1E1E] hover:italic transition-colors text-left">
                Door 05: Profile & Message Review
              </button>
            </li>
          </ul>
        </div>

        {/* Open Source & Tech */}
        <div className="space-y-2.5 text-xs font-sans">
          <p className="uppercase text-[#1E1E1E] font-bold tracking-[0.2em]">Repository & Specs</p>
          <p className="text-[#1E1E1E]/70 font-editorial leading-relaxed text-sm">
            Google AI Studio + Gemini 3.7 + Firebase architecture ready for autonomous wake cycles.
          </p>
          <a
            href="https://github.com/juanintendo/Fuelness-or-Foolness"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-2 text-[#1E1E1E] hover:underline pt-2 font-mono-code text-xs font-medium"
          >
            <GitBranch className="w-3.5 h-3.5 text-red-900" />
            <span>juanintendo/Fuelness-or-Foolness</span>
          </a>
        </div>
      </div>

      {/* Footer / Agent Status Bar */}
      <div className="border-t border-[#1E1E1E]/10 bg-[#EBE7DE] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
        <div className="flex gap-4 items-center">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Active Agents</span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#1E1E1E] flex items-center justify-center border-2 border-[#F4F1EA] text-[8px] text-[#F4F1EA]" title="Seduction Analyst">SA</div>
            <div className="w-6 h-6 rounded-full bg-[#1E1E1E] flex items-center justify-center border-2 border-[#F4F1EA] text-[8px] text-[#F4F1EA]" title="Fool Detector">FD</div>
            <div className="w-6 h-6 rounded-full bg-[#1E1E1E] flex items-center justify-center border-2 border-[#F4F1EA] text-[8px] text-[#F4F1EA]" title="Experiment Designer">ED</div>
            <div className="w-6 h-6 rounded-full bg-[#D1CFCA] flex items-center justify-center border-2 border-[#F4F1EA] text-[8px] text-[#1E1E1E]" title="Peer Reviewer">PR</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-green-700 animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-wider font-mono-code opacity-70">Lab Waking in: 04:22:11</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
          © 2026 fuelorfool.ing — Experimental Infrastructure No. 42
        </div>
      </div>
    </footer>
  );
};
