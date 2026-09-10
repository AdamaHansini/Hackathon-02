import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  QrCode, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Info,
  Sparkles
} from 'lucide-react';
import CyberInspector from './CyberInspector';
import { soundEffects } from '../utils/soundEffects';

export default function ChallengeCard({
  challenge,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  isSubmitted = false,
  submitting = false
}) {
  const [hoveredUrl, setHoveredUrl] = useState(false);

  if (!challenge) return null;

  const {
    title,
    category,
    scenario,
    question,
    options = [],
    difficulty = 'EASY',
    points = 10
  } = challenge;

  const categoryIcons = {
    PHISHING: Mail,
    PASSWORD: Lock,
    FAKE_QR: QrCode,
    SCAM_MESSAGE: MessageSquare
  };

  const IconComponent = categoryIcons[category] || AlertCircle;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Challenge Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                {category?.replace('_', ' ')}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700">
                +{points} Pts
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 uppercase">
            {difficulty}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Realistic Scenario Preview depending on Category */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Scenario Inspection Area</span>
            <span className="flex items-center gap-1 text-slate-400 font-normal normal-case">
              <Info className="w-3.5 h-3.5" /> Analyze clues carefully
            </span>
          </div>

          {/* Phishing Email Mockup */}
          {category === 'PHISHING' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Incoming Message Client</span>
                </div>
                <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                  Unverified Sender
                </span>
              </div>
              <pre className="text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                {scenario}
              </pre>
            </div>
          )}

          {/* Password Comparison & Strength Indicator */}
          {category === 'PASSWORD' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-sm text-slate-800 font-medium leading-relaxed">
                {scenario}
              </div>

              {/* Password Strength Reference Chart (Section 14) */}
              <div className="bg-slate-100/90 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-600 text-[11px] uppercase tracking-wide">
                  Password Strength Benchmark Reference:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-rose-600 font-bold mb-1">Weak (0-6 chars / leet)</div>
                    <div className="text-rose-500 font-extrabold tracking-widest text-xs">████░░░░░░</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-amber-600 font-bold mb-1">Medium (8-12 chars)</div>
                    <div className="text-amber-500 font-extrabold tracking-widest text-xs">██████░░░░</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-emerald-600 font-bold mb-1">Strong (16+ chars phrase)</div>
                    <div className="text-emerald-500 font-extrabold tracking-widest text-xs">██████████</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fake QR Scanner Mockup */}
          {category === 'FAKE_QR' && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-start gap-4">
                  {/* Simulated QR Code Stamp */}
                  <div className="w-24 h-24 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white shrink-0 p-2 shadow-sm border-2 border-dashed border-amber-400">
                    <QrCode className="w-12 h-12 text-slate-100" />
                    <span className="text-[9px] font-bold text-amber-300 mt-1 uppercase tracking-tighter">
                      Scan Target
                    </span>
                  </div>
                  <div className="flex-1 text-xs text-slate-800 font-medium leading-relaxed">
                    <div className="font-bold text-slate-900 mb-1 text-sm">
                      Physical Inspection & Context:
                    </div>
                    {scenario}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scam SMS Message Smartphone Mockup */}
          {category === 'SCAM_MESSAGE' && (
            <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                  <span>Messages</span>
                </div>
                <span className="text-[10px] text-slate-400">SMS Notification</span>
              </div>
              <div className="p-4 bg-slate-50 space-y-2">
                <div className="text-center text-[10px] text-slate-400 font-medium my-1">
                  Today • External Sender
                </div>
                <div className="bg-slate-200/90 text-slate-900 p-3.5 rounded-2xl rounded-tl-xs max-w-[90%] text-xs font-medium leading-relaxed shadow-xs">
                  {scenario}
                </div>
              </div>
            </div>
          )}
          {/* Advanced Forensic Tools HUD */}
          <CyberInspector challenge={challenge} />
        </div>

        {/* The Question */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Decision Required:
          </label>
          <h3 className="text-lg font-extrabold text-slate-900">
            {question}
          </h3>
        </div>

        {/* Answer Options as Interactive Cards (Section 11) */}
        <div className="space-y-2.5">
          {options.map((opt, idx) => {
            const isSelected = selectedAnswer === opt;
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => {
                  soundEffects.playSelect();
                  onSelectAnswer(opt);
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                    : isSubmitted
                    ? 'border-slate-200 bg-slate-50/60 text-slate-400 cursor-not-allowed'
                    : 'border-slate-200 hover:border-slate-400 bg-white text-slate-800 hover:bg-slate-50/80 cursor-pointer'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-900'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm font-semibold flex-1 leading-snug">
                  {opt}
                </span>
                {isSelected && (
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit Action Button */}
        {!isSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onSubmit}
              disabled={!selectedAnswer || submitting}
              className={`px-8 py-3 rounded-xl font-extrabold text-sm shadow-sm transition-all flex items-center gap-2 ${
                !selectedAnswer || submitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow cursor-pointer active:scale-98'
              }`}
            >
              {submitting ? 'Verifying Decision...' : 'Lock In Answer & Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
