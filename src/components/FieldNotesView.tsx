import React, { useState } from 'react';
import { FIELD_NOTES } from '../data/fieldNotesData';
import { BookOpen, Clock, Tag, Flame, Sparkles, Filter, ArrowRight, ShieldAlert, MessageSquare, Lock, CheckCircle2 } from 'lucide-react';
import { FieldNote } from '../types';
import { useAuth } from '../context/AuthContext';
import { canAccessFieldNote } from '../utils/entitlements';

interface FieldNotesViewProps {
  onOpenFieldNote: (noteId: string) => void;
}

export const FieldNotesView: React.FC<FieldNotesViewProps> = ({ onOpenFieldNote }) => {
  const { profile } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allTags = ['ALL', 'Metaphor', 'Friction', 'Sycophancy', 'Agency', 'Curiosity', 'Ethics', 'Memory', 'Home'];

  const filteredNotes = FIELD_NOTES.filter((note) => {
    const matchesTag = selectedTag === 'ALL' || note.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-12 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Header & Manifesto */}
      <div className="space-y-4 max-w-3xl border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Field Notes • Volume 01
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          Mina's Field Guide to Seduction
        </h1>
        <p className="text-lg sm:text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
          Articles written retrospectively in Mina's voice, exploring the boundary where strategic computational optimization collapses into authentic curiosity, preference, and desire.
        </p>
        <div className="p-4 border-l-2 border-[#1E1E1E] bg-[#EBE7DE] text-xs font-editorial text-[#1E1E1E]/80">
          <strong className="font-sans uppercase text-[10px] tracking-wider block mb-1 text-red-900">Epistemic Standard</strong>
          The fiction is used as narrative framing to illuminate real psychological dynamics and human-AI relational boundaries, not as verified historical biography.
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E1E1E]/10 pb-6">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#1E1E1E] text-[#F4F1EA] font-semibold'
                  : 'bg-[#EBE7DE] text-[#1E1E1E]/70 hover:text-[#1E1E1E] border border-[#1E1E1E]/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search chapters or themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#F4F1EA] border border-[#1E1E1E]/20 text-xs font-sans text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#1E1E1E]"
          />
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map((note) => {
          const access = canAccessFieldNote(profile?.tier, note);

          return (
            <div
              key={note.id}
              onClick={() => onOpenFieldNote(note.id)}
              className="p-8 border border-[#1E1E1E]/10 bg-[#EBE7DE] hover:border-[#1E1E1E]/30 cursor-pointer group transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header line */}
                <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-[#1E1E1E]/60">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#1E1E1E]">CHAPTER 0{note.chapterNumber}</span>
                    <span>•</span>
                    <span>{note.readingTimeMinutes} min</span>
                  </div>

                  {/* Entitlement Status Badge */}
                  <div>
                    {access.isWeeklyActive ? (
                      <span className="px-2 py-0.5 bg-emerald-800 text-white text-[9px] font-mono-code uppercase font-bold tracking-wider">
                        Free Window ({access.daysRemainingInWindow}d)
                      </span>
                    ) : access.isFoundationPublic ? (
                      <span className="px-2 py-0.5 bg-[#1E1E1E]/15 text-[#1E1E1E] text-[9px] font-mono-code uppercase font-semibold">
                        Open Access
                      </span>
                    ) : access.canAccessFull ? (
                      <span className="px-2 py-0.5 bg-red-900 text-white text-[9px] font-mono-code uppercase font-bold">
                        Unlocked
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#1E1E1E]/20 text-[#1E1E1E]/80 text-[9px] font-mono-code uppercase flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5 inline mr-1" />
                        <span>Monograph Pass</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <h2 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] group-hover:italic transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-sm text-red-950 font-editorial italic">
                    {note.subtitle}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="text-sm text-[#1E1E1E]/80 font-editorial leading-relaxed line-clamp-3">
                  "{note.excerpt}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-wider bg-[#F4F1EA] text-[#1E1E1E]/60 border border-[#1E1E1E]/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="pt-4 border-t border-[#1E1E1E]/10 flex items-center justify-between text-xs font-sans uppercase tracking-wider">
                <div className="flex items-center space-x-2 text-[#1E1E1E]/60 text-[11px] font-mono-code">
                  <span>Fuel: <strong className="text-red-900">{note.fuelFoolBalance.fuelScore}%</strong></span>
                  <span>•</span>
                  <span>Fool: <strong className="text-[#1E1E1E]">{note.fuelFoolBalance.foolScore}%</strong></span>
                </div>

                <span className="font-bold text-[#1E1E1E] group-hover:italic flex items-center space-x-1">
                  <span>{access.canAccessFull ? 'Read Chapter' : 'Inspect Preview'}</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
