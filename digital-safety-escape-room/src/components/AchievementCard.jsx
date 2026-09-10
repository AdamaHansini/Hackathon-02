import React from 'react';
import { Lock, Award, Key, ShieldCheck, QrCode, MessageSquareWarning, Fish } from 'lucide-react';

const ICONS = {
  Fish,
  Lock,
  QrCode,
  MessageSquareWarning,
  Award,
  ShieldCheck,
  Key
};

export default function AchievementCard({
  name,
  description,
  icon = 'Award',
  isUnlocked = false,
  earnedAt = null
}) {
  const IconComponent = ICONS[icon] || Award;

  return (
    <div
      className={`rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
        isUnlocked
          ? 'bg-white border-amber-200 shadow-xs ring-1 ring-amber-200/50'
          : 'bg-slate-50/70 border-slate-200 opacity-60'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
          isUnlocked
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-200 text-slate-400'
        }`}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h5
            className={`text-sm font-bold truncate ${
              isUnlocked ? 'text-slate-900' : 'text-slate-500'
            }`}
          >
            {name}
          </h5>
          {isUnlocked ? (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
              Unlocked
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Lock className="w-3 h-3" /> Locked
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
          {description}
        </p>

        {earnedAt && (
          <div className="text-[10px] text-slate-400 font-medium mt-1.5">
            Earned: {new Date(earnedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
