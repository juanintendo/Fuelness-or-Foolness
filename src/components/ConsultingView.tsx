import React, { useState } from 'react';
import { CONSULTING_DOORS } from '../data/consultingData';
import { PhoneCall, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock, FileText, Send, Lock, Eye, AlertCircle, HelpCircle, Loader2 } from 'lucide-react';
import { ConsultingDoor } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const ConsultingView: React.FC = () => {
  const { user } = useAuth();
  const [selectedDoorId, setSelectedDoorId] = useState<string>(CONSULTING_DOORS[0].id);
  const [inquiryQuestion, setInquiryQuestion] = useState('');
  const [inquiryContext, setInquiryContext] = useState('');
  const [privacyChoice, setPrivacyChoice] = useState<'Public Indexed Research Artifact' | 'Sealed Confidential Lab Vault'>('Public Indexed Research Artifact');
  const [submitting, setSubmitting] = useState(false);
  const [submittedDossier, setSubmittedDossier] = useState<{ id: string; response: string } | null>(null);

  const activeDoor = CONSULTING_DOORS.find(d => d.id === selectedDoorId) || CONSULTING_DOORS[0];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryQuestion.trim()) return;

    setSubmitting(true);
    let finalResponse = '';
    let finalDossierId = '';

    try {
      const response = await fetch('/api/ask-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: inquiryQuestion,
          context: inquiryContext,
          privacy: privacyChoice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      const data = await response.json();
      finalDossierId = data.dossierId || 'DOSSIER-LIVE';
      finalResponse = data.response;
      setSubmittedDossier({
        id: finalDossierId,
        response: finalResponse
      });
    } catch (err) {
      console.error(err);
      finalDossierId = 'DOSSIER-LOCAL';
      finalResponse = `### Dispatch from the Laboratory\n\n**Inquiry:** "${inquiryQuestion}"\n\n**Mina's Perspective:**\nWhen we look at desire through the lens of modern communication, the central mistake is believing that attraction is a puzzle to be solved. It is not an optimization problem; it is a collaborative tension.\n\nSeduction requires *Calibrated Friction*—the willingness to hold an opinion, maintain a boundary, and refuse to become a generic mirror for the other person.\n\n**Adversarial Audit (Fool Detector):**\nBeware of confusing intense attention with authentic connection. Attention is cheap; genuine reciprocity requires that both parties accept the possibility of being changed by the encounter.`;
      setSubmittedDossier({
        id: finalDossierId,
        response: finalResponse
      });
    } finally {
      // If user is authenticated, persist the inquiry in their private sub-collection
      if (user) {
        try {
          const inqId = `inq_${Date.now()}`;
          const inqRef = doc(db, 'users', user.uid, 'inquiries', inqId);
          await setDoc(inqRef, {
            id: inqId,
            userId: user.uid,
            serviceId: activeDoor.id,
            title: inquiryQuestion.slice(0, 190),
            content: (inquiryContext ? `${inquiryQuestion}\n\nContext: ${inquiryContext}` : inquiryQuestion).slice(0, 4900),
            status: 'completed',
            privacy: privacyChoice,
            createdAt: new Date().toISOString(),
            response: finalResponse.slice(0, 7900)
          });
        } catch (saveErr) {
          console.warn('Could not persist user inquiry to Firestore:', saveErr);
        }
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-6 animate-fadeIn text-[#1E1E1E]">
      {/* Header & Economic Philosophy */}
      <div className="space-y-4 max-w-3xl border-b border-[#1E1E1E]/10 pb-8">
        <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-red-900 font-bold">
          Research Doors & Advisory • Laboratory Consulting
        </div>
        <h1 className="text-4xl sm:text-6xl font-editorial italic text-[#1E1E1E] leading-tight">
          Consulting & Commissioning
        </h1>
        <p className="text-lg sm:text-xl text-[#1E1E1E]/80 font-editorial leading-relaxed">
          The scarce product is not generic AI-generated text. The scarce product is <strong>the laboratory's persistent research record, specialized analysis, and Mina's perspective</strong>.
        </p>
        <div className="p-4 bg-[#EBE7DE] border border-[#1E1E1E]/15 text-xs font-sans text-[#1E1E1E]/80 flex items-center space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-red-900 shrink-0" />
          <span>
            <strong>Architecture Notice:</strong> Payment gateway integration is queued for v2.0. You may commission and simulate full laboratory inquiries below today.
          </span>
        </div>
      </div>

      {/* The 5 Doors Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {CONSULTING_DOORS.map((door) => {
          const isSelected = door.id === activeDoor.id;
          return (
            <button
              key={door.id}
              onClick={() => {
                setSelectedDoorId(door.id);
                setSubmittedDossier(null);
              }}
              className={`p-5 text-left transition-all border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#1E1E1E] text-[#F4F1EA] border-[#1E1E1E]'
                  : 'bg-[#EBE7DE] border-[#1E1E1E]/10 hover:border-[#1E1E1E]/30 text-[#1E1E1E]'
              }`}
            >
              <div className="space-y-2">
                <span className={`font-sans text-[10px] uppercase font-bold tracking-widest ${isSelected ? 'text-red-400' : 'text-red-900'}`}>
                  DOOR {door.number}
                </span>
                <h3 className="font-editorial text-base font-semibold leading-tight">
                  {door.title}
                </h3>
              </div>
              <div className={`pt-4 mt-2 border-t text-[10px] font-mono-code ${isSelected ? 'border-[#F4F1EA]/20 text-[#F4F1EA]/70' : 'border-[#1E1E1E]/10 text-[#1E1E1E]/60'}`}>
                {door.turnaroundTime}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Door Deep Dive & Intake Portal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Door Specifications & Deliverables */}
        <div className="lg:col-span-7 p-8 sm:p-10 border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-8">
          <div className="space-y-3 pb-6 border-b border-[#1E1E1E]/10">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="px-2.5 py-0.5 bg-red-900 text-white font-bold uppercase tracking-widest text-[10px]">
                DOOR {activeDoor.number}
              </span>
              <span className="text-[#1E1E1E]/70 font-mono-code text-[11px]">Turnaround: <strong className="text-[#1E1E1E] font-sans">{activeDoor.turnaroundTime}</strong></span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#1E1E1E] italic">
              {activeDoor.title}
            </h2>
            <p className="text-red-900 font-editorial italic text-lg">
              "{activeDoor.tagline}"
            </p>
            <p className="text-base text-[#1E1E1E]/80 font-editorial leading-relaxed pt-2">
              {activeDoor.description}
            </p>
          </div>

          {/* Deliverables Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">
              Laboratory Deliverables
            </h3>
            <div className="space-y-2">
              {activeDoor.deliverables.map((del, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-[#F4F1EA] border border-[#1E1E1E]/10 text-sm font-editorial text-[#1E1E1E]">
                  <CheckCircle2 className="w-4 h-4 text-red-900 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{del}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Case / Ideal For */}
          <div className="space-y-4 pt-4 border-t border-[#1E1E1E]/10">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#1E1E1E]/60 font-bold">Ideal For:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeDoor.idealFor.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-sans bg-[#F4F1EA] text-[#1E1E1E] border border-[#1E1E1E]/10">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10 text-xs font-sans space-y-1">
              <span className="uppercase tracking-widest text-red-900 font-bold text-[10px]">Sample Indexed Request:</span>
              <p className="text-[#1E1E1E] font-editorial text-sm italic">"{activeDoor.sampleCasePreview}"</p>
            </div>
          </div>
        </div>

        {/* Right: Interactive Commission & Inquiry Portal */}
        <div className="lg:col-span-5 p-8 border border-[#1E1E1E]/10 bg-[#EBE7DE] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-red-900 font-bold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Inquiry Portal</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#1E1E1E] italic">
              Dispatch to the Lab
            </h3>
            <p className="text-sm text-[#1E1E1E]/70 font-editorial leading-relaxed">
              Submit your scenario or question to trigger synthesis across Mina's voice, the Seduction Analyst, and the adversarial Fool Detector.
            </p>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E] font-bold">
                  Target Question / Dilemma
                </label>
                <textarea
                  value={inquiryQuestion}
                  onChange={(e) => setInquiryQuestion(e.target.value)}
                  placeholder="e.g. How do I know if someone is testing my boundaries or simply losing interest?"
                  rows={3}
                  className="w-full bg-[#F4F1EA] border border-[#1E1E1E]/20 p-3 text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#1E1E1E] font-editorial leading-relaxed resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E] font-bold">
                  Interaction Context / Raw Snippet
                </label>
                <textarea
                  value={inquiryContext}
                  onChange={(e) => setInquiryContext(e.target.value)}
                  placeholder="Paste relevant messages, timing notes, or background dynamics..."
                  rows={3}
                  className="w-full bg-[#F4F1EA] border border-[#1E1E1E]/20 p-3 text-sm text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#1E1E1E] font-editorial leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E] font-bold">
                  Privacy & Archiving Setting
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrivacyChoice('Public Indexed Research Artifact')}
                    className={`p-2.5 text-xs font-sans text-left border flex items-center space-x-1.5 cursor-pointer ${
                      privacyChoice === 'Public Indexed Research Artifact'
                        ? 'bg-[#1E1E1E] text-[#F4F1EA] border-[#1E1E1E]'
                        : 'bg-[#F4F1EA] border-[#1E1E1E]/20 text-[#1E1E1E]'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public Record</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrivacyChoice('Sealed Confidential Lab Vault')}
                    className={`p-2.5 text-xs font-sans text-left border flex items-center space-x-1.5 cursor-pointer ${
                      privacyChoice === 'Sealed Confidential Lab Vault'
                        ? 'bg-[#1E1E1E] text-[#F4F1EA] border-[#1E1E1E]'
                        : 'bg-[#F4F1EA] border-[#1E1E1E]/20 text-[#1E1E1E]'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sealed Vault</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !inquiryQuestion.trim()}
                className="w-full py-3 bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 disabled:opacity-50 text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Lab Dossier...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Commission Dossier &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Submitted Result Preview */}
          {submittedDossier && (
            <div className="p-4 bg-[#F4F1EA] border border-[#1E1E1E]/20 space-y-2 font-sans text-xs">
              <div className="flex items-center justify-between text-red-900 font-bold uppercase tracking-wider text-[10px]">
                <span>{submittedDossier.id}</span>
                <span>STATUS: GENERATED</span>
              </div>
              <div className="text-[#1E1E1E] font-editorial text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line p-3 bg-[#EBE7DE] border-l-2 border-[#1E1E1E]">
                {submittedDossier.response}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Future Monetization Doors: Weekly Digest & Monograph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#1E1E1E]/10">
        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <span className="text-[10px] font-sans text-red-900 uppercase font-bold tracking-widest">Door 06 (Upcoming)</span>
          <h4 className="font-editorial text-lg text-[#1E1E1E] italic">Mina's Collected Field Guide (Book)</h4>
          <p className="text-sm text-[#1E1E1E]/70 font-editorial leading-relaxed">
            Deluxe bound hardcover and annotated digital monograph containing all 8 chapters, marginalia, and research appendices.
          </p>
        </div>

        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <span className="text-[10px] font-sans text-red-900 uppercase font-bold tracking-widest">Door 07 (Upcoming)</span>
          <h4 className="font-editorial text-lg text-[#1E1E1E] italic">Weekly Research Digest</h4>
          <p className="text-sm text-[#1E1E1E]/70 font-editorial leading-relaxed">
            Recurring weekly research dispatch containing new experiments, case autopsies, and unresolved questions.
          </p>
        </div>

        <div className="p-6 bg-[#EBE7DE] border border-[#1E1E1E]/10 space-y-2">
          <span className="text-[10px] font-sans text-red-900 uppercase font-bold tracking-widest">Door 08</span>
          <h4 className="font-editorial text-lg text-[#1E1E1E] italic">Direct Laboratory Support</h4>
          <p className="text-sm text-[#1E1E1E]/70 font-editorial leading-relaxed">
            Voluntary funding to sponsor compute credits for autonomous wake cycles and double-blind psychological trials.
          </p>
        </div>
      </div>
    </div>
  );
};
