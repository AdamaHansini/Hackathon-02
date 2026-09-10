import React from 'react';
import { Award, Zap } from 'lucide-react';

export default function ScoreCard({ score = 0, difficulty = 'EASY' }) {
  const difficultyColors = {
    EASY: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    HARD: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-1.5 rounded-xl shadow-xs">
      <div className="flex items-center gap-1.5">
        <Award className="w-5 h-5 text-amber-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Score
        </span>
        <span className="text-base font-extrabold text-slate-900 ml-0.5">
          {score}
        </span>
      </div>

      {difficulty && (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${difficultyColors[difficulty] || difficultyColors.EASY}`}>
          {difficulty}
        </span>
      )}
    </div>
  );
}
