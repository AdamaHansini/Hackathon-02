import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Explanation({
  feedback,
  onNext,
  isGameOver = false,
  isCompleted = false
}) {
  if (!feedback) return null;

  const isCorrect = feedback.isCorrect;

  return (
    <div
      className={`rounded-2xl p-6 border transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-sm ${
        isCorrect
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
          : 'bg-rose-50/90 border-rose-300 text-rose-950'
      }`}
    >
      {/* Feedback Banner Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isCorrect
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-rose-600 text-white shadow-sm'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <XCircle className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight">
                {isCorrect ? 'Correct Decision!' : 'Security Breach! Unsafe Choice'}
              </h3>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isCorrect
                    ? 'bg-emerald-200 text-emerald-900'
                    : 'bg-rose-200 text-rose-900'
                }`}
              >
                {isCorrect ? `+${feedback.pointsEarned} Points` : '-1 Life Lost'}
              </span>
            </div>
            <p className="text-sm font-medium mt-0.5 opacity-90">
              {isCorrect
                ? 'You successfully recognized the cybersecurity indicators and defended against the threat.'
                : 'You fell for a threat indicator. Review the cybersecurity analysis below to learn.'}
            </p>
          </div>
        </div>

        {/* Next / Proceed Button */}
        <button
          onClick={onNext}
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-transform active:scale-95 ${
            isCorrect
              ? 'bg-emerald-700 hover:bg-emerald-800'
              : 'bg-rose-700 hover:bg-rose-800'
          }`}
        >
          {isGameOver ? 'View Game Over' : isCompleted ? 'Unlock Escape Room' : 'Next Challenge'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Why? Explanation Section (Section 19) */}
      <div className="mt-5 pt-4 border-t border-current/15 space-y-3">
        {!isCorrect && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {feedback.selectedAnswer && (
              <div className="bg-rose-100/70 border border-rose-300 p-3 rounded-xl">
                <div className="font-bold text-rose-800 uppercase tracking-wider text-[10px] mb-0.5">
                  Your Decision (Compromised):
                </div>
                <div className="text-rose-950 font-semibold">{feedback.selectedAnswer}</div>
              </div>
            )}
            {feedback.correctAnswer && (
              <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-xl">
                <div className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] mb-0.5">
                  Safe & Secure Countermeasure:
                </div>
                <div className="text-emerald-950 font-semibold">{feedback.correctAnswer}</div>
              </div>
            )}
          </div>
        )}

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Why? Cybersecurity Analysis
          </h4>
          <p className="text-sm leading-relaxed font-medium">
            {feedback.explanation}
          </p>
        </div>
      </div>

      {/* Warning Signs Checklist */}
      {feedback.warningSigns && feedback.warningSigns.length > 0 && (
        <div className="mt-4 pt-3 border-t border-current/15">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Key Threat Indicators to Remember:
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {feedback.warningSigns.map((sign, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs font-medium bg-white/70 p-2.5 rounded-lg border border-current/10"
              >
                <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
