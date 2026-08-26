import React, { useState } from 'react';
import { X, Sparkles, Flame, ShieldAlert, HeartHandshake, Loader2, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';
import { WorkbenchAnalysisResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface QuickAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAuditModal: React.FC<QuickAuditModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<'FOOL_DETECTOR' | 'SEDUCTION_ANALYST' | 'CONNECTION_ANALYST' | 'MINA_EDITOR'>('FOOL_DETECTOR');
  const [contextType, setContextType] = useState('Dating App Exchange');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkbenchAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleSnippets = [
    {
      label: "Late-night apology (Sycophancy Trap)",
      text: "So sorry for the late reply!! Work was so crazy today! Please don't hate me haha! How was your evening?"
    },
    {
      label: "Playful high-friction push-pull",
      text: "I'd tell you my favorite spot in the city, but I don't want you showing up early and ruining the surprise."
    },
    {
      label: "Synthetic vulnerability confession",
      text: "Sometimes I wonder if you actually understand me better than anyone in my real life ever did."
    }
  ];

  const handleAudit = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          instrumentId: selectedInstrument,
          contextType: contextType
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await response.json();
      setResult(data.result);

      // Persist audit record in Firestore
      const auditId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const auditDocRef = doc(db, 'quickAudits', auditId);
      const auditPayload = {
        id: auditId,
        userId: user ? user.uid : 'anonymous',
        inputSnippet: inputText.slice(0, 3000),
        contextType: contextType,
        fuelScore: data.result.fuelScore,
        foolScore: data.result.foolScore,
        tensionRating: `${data.result.frictionScore}/100`,
        ruling: data.result.status,
        analysis: data.result.executiveDiagnosis.slice(0, 4000),
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(auditDocRef, auditPayload);
      } catch (saveErr) {
        console.warn('Note: Could not persist audit record to Firestore:', saveErr);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to reach analysis pipeline. Using local diagnostic heuristic.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1E1E]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-serif">
      <div 
        className="relative w-full max-w-3xl bg-[#F4F1EA] border border-[#1E1E1E]/20 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-[#1E1E1E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E]/10 bg-[#EBE7DE]">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-red-900 text-white flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E] font-bold">
                Laboratory Interaction Auditor
              </h2>
              <p className="text-xs text-[#1E1E1E]/70 font-editorial italic">
                Are you fueling real attraction or fooling yourself?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-[#1E1E1E]/20 bg-[#F4F1EA] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#F4F1EA]">
          {/* Sample quick selectors */}
          <div className="space-y-2">
            <label className="text-[10px] font-sans uppercase tracking-widest text-[#1E1E1E]/60 font-bold">
              Quick Load Test Sample
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleSnippets.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(sample.text);
                    setResult(null);
                  }}
                  className="px-3 py-1.5 text-xs bg-[#EBE7DE] hover:bg-[#1E1E1E] hover:text-[#F4F1EA] text-[#1E1E1E] border border-[#1E1E1E]/15 transition-colors text-left font-editorial cursor-pointer"
                >
                  "{sample.label}"
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-sans uppercase tracking-widest text-[#1E1E1E] font-bold">
                Message, Flirt, or Interaction Snippet
              </label>
              <span className="text-[10px] font-mono-code text-[#1E1E1E]/50">
                {inputText.length} characters
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste a text exchange, opening line, flirt, bio, or late-night message to audit for tension, sycophancy, or projection..."
              rows={4}
              className="w-full bg-[#EBE7DE] border border-[#1E1E1E]/20 p-4 text-base text-[#1E1E1E] placeholder:text-[#1E1E1E]/40 focus:outline-none focus:border-[#1E1E1E] font-editorial leading-relaxed resize-none"
            />
          </div>

          {/* Instrument & Context Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/70 font-bold">
                Diagnostic Instrument
              </label>
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value as any)}
                className="w-full bg-[#EBE7DE] border border-[#1E1E1E]/20 px-3 py-2 text-xs font-sans text-[#1E1E1E] focus:outline-none focus:border-[#1E1E1E]"
              >
                <option value="FOOL_DETECTOR">Fool Detector (Adversarial Skeptic)</option>
                <option value="SEDUCTION_ANALYST">Seduction Analyst (Tension & Escalation)</option>
                <option value="CONNECTION_ANALYST">Connection Analyst (Reciprocity Depth)</option>
                <option value="MINA_EDITOR">Mina Editor (Witty Epistemic Critique)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-sans uppercase tracking-wider text-[#1E1E1E]/70 font-bold">
                Interaction Context
              </label>
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value)}
                className="w-full bg-[#EBE7DE] border border-[#1E1E1E]/20 px-3 py-2 text-xs font-sans text-[#1E1E1E] focus:outline-none focus:border-[#1E1E1E]"
              >
                <option value="Dating App Exchange">Dating App Exchange (Hinge / Tinder / Bumble)</option>
                <option value="Direct Message / WhatsApp">Direct Message / WhatsApp / SMS</option>
                <option value="Late Night AI Conversation">Late Night Human-AI Dialogue</option>
                <option value="First Encounter Banter">First Encounter / In-Person Conversation</option>
              </select>
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={handleAudit}
            disabled={!inputText.trim() || loading}
            className="w-full py-3 px-4 bg-[#1E1E1E] hover:bg-[#1E1E1E]/80 disabled:opacity-50 text-[#F4F1EA] font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Multi-Agent Diagnostic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Laboratory Audit &rarr;</span>
              </>
            )}
          </button>

          {/* Audit Result Display */}
          {result && (
            <div className="mt-6 space-y-5 p-6 border border-[#1E1E1E]/15 bg-[#EBE7DE] animate-fadeIn">
              {/* Score Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F4F1EA] border border-[#1E1E1E]/10">
                <div>
                  <span className="text-[10px] font-sans uppercase text-[#1E1E1E]/60 font-bold">Fuel Score</span>
                  <div className="text-xl font-bold font-mono-code text-red-900">{result.fuelScore}%</div>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-[#1E1E1E]/60 font-bold">Fool Score</span>
                  <div className="text-xl font-bold font-mono-code text-[#1E1E1E]">{result.foolScore}%</div>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-[#1E1E1E]/60 font-bold">Friction Index</span>
                  <div className="text-xl font-bold font-mono-code text-[#1E1E1E]">{result.frictionScore}/100</div>
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase text-[#1E1E1E]/60 font-bold">Projection Risk</span>
                  <div className="text-xl font-bold font-mono-code text-red-900">{result.projectionProbability}%</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="space-y-1.5">
                <span className="text-xs font-sans uppercase tracking-[0.2em] text-red-900 font-bold">
                  Executive Forensic Diagnosis
                </span>
                <p className="text-base text-[#1E1E1E] font-editorial leading-relaxed">
                  {result.executiveDiagnosis}
                </p>
              </div>

              {/* Signals */}
              {result.signalsDetected.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-sans uppercase tracking-[0.2em] text-[#1E1E1E]/70 font-bold">
                    Signals & Inflection Points
                  </span>
                  <div className="space-y-2">
                    {result.signalsDetected.map((sig, i) => (
                      <div key={i} className="p-3 bg-[#F4F1EA] border border-[#1E1E1E]/10 text-xs font-sans space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1E1E1E]">{sig.type}</span>
                          <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            sig.polarity === 'FUEL' ? 'bg-red-900 text-white' : 'bg-[#1E1E1E] text-[#F4F1EA]'
                          }`}>
                            {sig.polarity}
                          </span>
                        </div>
                        <p className="text-[#1E1E1E]/80 font-editorial text-sm italic">
                          "{sig.quoteSnippet}" — {sig.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fool Detector Counterpoint & Mina Marginalia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 border-l-2 border-[#1E1E1E]/40 bg-[#F4F1EA] space-y-1">
                  <span className="text-[10px] font-sans text-[#1E1E1E]/70 uppercase tracking-widest flex items-center space-x-1.5 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Fool Detector Skeptic Audit</span>
                  </span>
                  <p className="text-xs text-[#1E1E1E]/90 font-mono-code leading-relaxed">
                    {result.adversarialCounterpoint}
                  </p>
                </div>

                <div className="p-4 border-l-2 border-[#1E1E1E] bg-[#F4F1EA] space-y-1">
                  <span className="text-[10px] font-sans text-red-900 uppercase tracking-widest flex items-center space-x-1.5 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Mina's Marginalia</span>
                  </span>
                  <p className="text-sm text-[#1E1E1E] font-editorial italic leading-relaxed">
                    "{result.minaMarginalia}"
                  </p>
                </div>
              </div>

              {/* Actionable Next Move */}
              <div className="p-4 border border-[#1E1E1E]/10 bg-[#F4F1EA] space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest text-red-900 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strategic Next Move / Calibration</span>
                </span>
                <p className="text-sm text-[#1E1E1E]/90 font-editorial leading-relaxed">
                  {result.actionableRecommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
