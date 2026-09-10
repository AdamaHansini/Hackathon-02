import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Star } from 'lucide-react';

export default function BadgeCard({
  badge,
  percentage,
  size = 'md',
  showDescription = true
}) {
  const badgeTitle = typeof badge === 'string' ? badge : badge?.title || 'CYBER BEGINNER';
  const isExpert = badgeTitle.includes('EXPERT');
  const isSmart = badgeTitle.includes('SMART');

  const config = isExpert
    ? {
        title: 'CYBER SAFETY EXPERT',
        subtitle: '76% – 100% Score',
        desc: 'Strong awareness of common cyber threats and high defense precision.',
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-900',
        iconBg: 'bg-amber-500 text-white',
        tagBg: 'bg-amber-100 text-amber-800'
      }
    : isSmart
    ? {
        title: 'CYBER SMART',
        subtitle: '41% – 75% Score',
        desc: 'Understands most common digital safety risks and phishing patterns.',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-900',
        iconBg: 'bg-indigo-600 text-white',
        tagBg: 'bg-indigo-100 text-indigo-800'
      }
    : {
        title: 'CYBER BEGINNER',
        subtitle: '0% – 40% Score',
        desc: 'Needs more practice with basic cyber safety and deceptive message spotting.',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        iconBg: 'bg-emerald-600 text-white',
        tagBg: 'bg-emerald-100 text-emerald-800'
      };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-xs ${config.bg} ${config.border}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-sm ${config.iconBg}`}
        >
          {isExpert ? (
            <Award className="w-7 h-7" />
          ) : isSmart ? (
            <ShieldCheck className="w-7 h-7" />
          ) : (
            <ShieldAlert className="w-7 h-7" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className={`text-base font-extrabold tracking-tight ${config.text}`}>
              {config.title}
            </h4>
            {percentage !== undefined && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.tagBg}`}>
                {percentage}%
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {config.subtitle}
          </p>
        </div>
      </div>

      {showDescription && (
        <p className={`text-xs font-medium mt-3 pt-3 border-t border-slate-200/60 leading-relaxed ${config.text}`}>
          "{config.desc}"
        </p>
      )}
    </div>
  );
}
