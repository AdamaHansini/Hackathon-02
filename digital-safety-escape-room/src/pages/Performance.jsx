import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { userService } from '../services/userService';

export default function Performance({ navigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await userService.getStatistics();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load performance analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading performance analytics...</div>;
  }

  const breakdown = stats?.categoryBreakdown || {};

  const categories = [
    { key: 'PHISHING', label: 'Phishing Detection', color: 'bg-rose-500' },
    { key: 'PASSWORD', label: 'Password Security', color: 'bg-indigo-500' },
    { key: 'FAKE_QR', label: 'Fake QR Analysis', color: 'bg-amber-500' },
    { key: 'SCAM_MESSAGE', label: 'Scam Messages', color: 'bg-emerald-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Cyber Defense Performance Analytics
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Deep diagnostic breakdown of your threat identification accuracy across each category.
        </p>
      </div>

      {/* Strongest & Weakest Category Cards (Section 24) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Strongest Area</span>
          </div>
          <div className="text-2xl font-black text-emerald-950">
            {stats?.strongestArea || 'None yet'}
          </div>
          <p className="text-xs text-emerald-800/80 font-medium mt-1">
            Consistently high accuracy when evaluating this attack vector.
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            <span>Needs Improvement</span>
          </div>
          <div className="text-2xl font-black text-amber-950">
            {stats?.weakestArea || 'None yet'}
          </div>
          <p className="text-xs text-amber-800/80 font-medium mt-1">
            Focus training repetitions here to eliminate exploitable security blindspots.
          </p>
        </div>
      </div>

      {/* Category Performance Progress Bars (Section 24) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Category Performance Breakdown
        </h3>

        <div className="space-y-5">
          {categories.map((cat) => {
            const data = breakdown[cat.key] || { total: 0, correct: 0, percentage: 0 };
            const pct = data.percentage || 0;

            return (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{cat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-medium">
                      {data.correct} of {data.total} correct
                    </span>
                    <span className="text-slate-900 font-extrabold w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Learning Recommendations (Section 25) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Personalized Learning Recommendations
          </h3>
        </div>

        {stats?.recommendations && stats.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.recommendations.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1"
              >
                <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider">
                  {item.category}
                </div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  ✓ {item.tip}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            Outstanding work! You have maintained over 70% accuracy across all categories. Continue playing to keep instincts sharp!
          </div>
        )}
      </div>
    </div>
  );
}
