import React from 'react';
import { Lock, Unlock, Key, CheckCircle2 } from 'lucide-react';

export default function ProgressBar({
  currentIndex = 0,
  total = 4,
  categoryStages = [],
  currentCategory = ''
}) {
  const progressPercent = total > 0 ? Math.round(((currentIndex) / total) * 100) : 0;

  const defaultCategories = [
    { key: 'PHISHING', label: 'Phishing' },
    { key: 'PASSWORD', label: 'Password' },
    { key: 'FAKE_QR', label: 'Fake QR' },
    { key: 'SCAM_MESSAGE', label: 'Scam Msg' }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Top row: Challenge count & percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
            {currentIndex + 1}
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Challenge {Math.min(currentIndex + 1, total)} of {total}
          </span>
        </div>
        <div className="text-sm font-bold text-slate-600">
          {progressPercent}% Complete
        </div>
      </div>

      {/* Visual Linear Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
        <div
          className="bg-emerald-500 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Escape Room Stage Progression Locks (Section 10) */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Escape Room Locks
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {defaultCategories.map((cat, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={cat.key}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isPassed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : isCurrent
                    ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="truncate">{cat.label}</span>
                <span className="ml-1.5 flex items-center">
                  {isPassed ? (
                    <Unlock className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Key className="w-4 h-4 text-amber-600 animate-bounce" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
