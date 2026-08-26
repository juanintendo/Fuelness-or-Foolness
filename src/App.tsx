import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { FieldNotesView } from './components/FieldNotesView';
import { FieldNoteDetailModal } from './components/FieldNoteDetailModal';
import { ExperimentsView } from './components/ExperimentsView';
import { ExperimentDetailModal } from './components/ExperimentDetailModal';
import { CasesView } from './components/CasesView';
import { ConsultingView } from './components/ConsultingView';
import { LabStatusView } from './components/LabStatusView';
import { AgentsView } from './components/AgentsView';
import { AboutView } from './components/AboutView';
import { QuickAuditModal } from './components/QuickAuditModal';
import { getFieldNoteById } from './repositories/fieldNotesRepository';
import { getExperimentById } from './repositories/experimentsRepository';
import { FieldNote, Experiment } from './types';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { profile } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeFieldNoteId, setActiveFieldNoteId] = useState<string | null>(null);
  const [activeExperimentId, setActiveExperimentId] = useState<string | null>(null);
  const [activeFieldNote, setActiveFieldNote] = useState<FieldNote | null>(null);
  const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Resolve active field note when ID changes
  useEffect(() => {
    let isMounted = true;
    if (!activeFieldNoteId) {
      setActiveFieldNote(null);
      return;
    }
    getFieldNoteById(activeFieldNoteId, profile?.tier).then(note => {
      if (isMounted) setActiveFieldNote(note);
    });
    return () => {
      isMounted = false;
    };
  }, [activeFieldNoteId, profile?.tier]);

  // Resolve active experiment when ID changes
  useEffect(() => {
    let isMounted = true;
    if (!activeExperimentId) {
      setActiveExperiment(null);
      return;
    }
    getExperimentById(activeExperimentId).then(exp => {
      if (isMounted) setActiveExperiment(exp);
    });
    return () => {
      isMounted = false;
    };
  }, [activeExperimentId]);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1E1E1E] flex flex-col selection:bg-[#1E1E1E] selection:text-[#F4F1EA] relative border-[8px] sm:border-[12px] border-[#F4F1EA]">
      {/* Background ambient editorial texture */}
      <div className="fixed inset-0 bg-lab-grid opacity-60 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-radial-vignette opacity-70 pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenAudit={() => setIsAuditModalOpen(true)}
        />

        {/* Primary Main Content View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {currentTab === 'home' && (
            <HomeView
              onSelectTab={setCurrentTab}
              onOpenFieldNote={(id) => setActiveFieldNoteId(id)}
              onOpenExperiment={(id) => setActiveExperimentId(id)}
              onOpenAudit={() => setIsAuditModalOpen(true)}
            />
          )}

          {currentTab === 'field-notes' && (
            <FieldNotesView
              onOpenFieldNote={(id) => setActiveFieldNoteId(id)}
            />
          )}

          {currentTab === 'experiments' && (
            <ExperimentsView
              onOpenExperiment={(id) => setActiveExperimentId(id)}
              onOpenFieldNote={(id) => {
                setActiveFieldNoteId(id);
              }}
            />
          )}

          {currentTab === 'cases' && (
            <CasesView />
          )}

          {currentTab === 'consulting' && (
            <ConsultingView />
          )}

          {currentTab === 'lab' && (
            <LabStatusView />
          )}

          {currentTab === 'agents' && (
            <AgentsView />
          )}

          {currentTab === 'about' && (
            <AboutView />
          )}
        </main>

        {/* Literary & Technical Footer */}
        <Footer onSelectTab={setCurrentTab} />
      </div>

      {/* Modals */}
      <FieldNoteDetailModal
        note={activeFieldNote}
        onClose={() => setActiveFieldNoteId(null)}
        onSelectExperiment={(expId) => {
          setActiveExperimentId(expId);
        }}
      />

      <ExperimentDetailModal
        experiment={activeExperiment}
        onClose={() => setActiveExperimentId(null)}
        onSelectFieldNote={(fnId) => {
          setActiveFieldNoteId(fnId);
        }}
      />

      <QuickAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
