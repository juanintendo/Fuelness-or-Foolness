import React from 'react';
import { ShieldAlert, Sparkles, Activity, Compass, FlaskConical, BookOpen, Layers, PhoneCall, Info } from 'lucide-react';
import { MinaStamp } from './MinaStamp';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAudit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAudit }) => {
  const navItems = [
    { id: 'field-notes', label: 'Field Notes', icon: BookOpen, tag: 'Ch. 01–08' },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical, tag: 'EXP-001–005' },
    { id: 'cases', label: 'Cases', icon: Layers, tag: 'Autopsies' },
    { id: 'consulting', label: 'Consulting', icon: PhoneCall, tag: '5 Doors' },
    { id: 'lab', label: 'Lab Status', icon: Activity, tag: 'Telemetry' },
    { id: 'agents', label: 'Instruments', icon: Compass, tag: '12 Agents' },
    { id: 'about', label: 'About & Charter', icon: Info, tag: 'Mina\'s House' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E1E1E]/10 bg-[#F4F1EA]/95 backdrop-blur-md">
      {/* Top telemetry ticker strip */}
      <div className="hidden md:flex items-center justify-between px-8 py-2 text-[11px] font-mono-code border-b border-[#1E1E1E]/10 bg-[#EBE7DE] text-[#1E1E1E]/70">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-800 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-900"></span>
            </span>
            <span className="text-[#1E1E1E] font-bold tracking-wider">LAB TICK #1,402</span>
          </div>
          <span className="text-[#1E1E1E]/20">|</span>
          <span>DOMAIN: <span className="font-semibold text-[#1E1E1E]">fuelorfool.ing</span></span>
          <span className="text-[#1E1E1E]/20">|</span>
          <span>BALANCE: <span className="text-red-900 font-bold">54% FUEL</span> / <span className="text-[#1E1E1E]/80 font-bold">46% FOOL</span></span>
        </div>

        <div className="flex items-center space-x-4">
          <span>STATE: <span className="text-emerald-900 font-semibold">AUTONOMOUS OBSERVATION</span></span>
          <span className="text-[#1E1E1E]/20">|</span>
          <span>REPO: <a href="https://github.com/juanintendo/Fuelness-or-Foolness" target="_blank" rel="noreferrer" className="text-[#1E1E1E] hover:underline font-semibold">juanintendo/Fuelness-or-Foolness</a></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <button 
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-3.5 text-left group focus:outline-none cursor-pointer"
            id="brand-home-btn"
          >
            <MinaStamp className="w-10 h-11 sm:w-11 sm:h-12 shrink-0 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold tracking-tighter uppercase font-display text-[#1E1E1E]">
                  Fuel or Fool
                </span>
                <span className="text-[9px] uppercase font-mono-code px-1.5 py-0.5 bg-red-900 text-white tracking-wider">
                  Vol. 01
                </span>
              </div>
              <span className="text-[10px] tracking-[0.2em] font-sans uppercase opacity-60 text-[#1E1E1E]">
                Autonomous AI Research Laboratory
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-6 font-sans text-xs tracking-widest uppercase" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`pb-1 transition-all cursor-pointer ${
                    isActive 
                      ? 'text-[#1E1E1E] font-bold border-b-2 border-[#1E1E1E] italic' 
                      : 'text-[#1E1E1E]/60 hover:text-[#1E1E1E] hover:italic'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right actions: Quick Audit Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAudit}
              id="quick-audit-btn"
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-sans uppercase tracking-widest border border-[#1E1E1E] bg-[#1E1E1E] text-[#F4F1EA] hover:bg-[#1E1E1E]/85 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F4F1EA]" />
              <span>Audit Interaction</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="lg:hidden flex items-center space-x-2 overflow-x-auto py-2.5 border-t border-[#1E1E1E]/10 no-scrollbar font-sans text-xs tracking-widest uppercase">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap px-3 py-1 text-xs uppercase ${
                  isActive ? 'bg-[#1E1E1E] text-[#F4F1EA] font-semibold' : 'text-[#1E1E1E]/60 hover:text-[#1E1E1E] bg-[#EBE7DE]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
