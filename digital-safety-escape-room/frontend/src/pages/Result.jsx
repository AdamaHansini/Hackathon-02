import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  BarChart3, 
  History, 
  Home, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Heart, 
  Key, 
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { gameService } from '../services/gameService';
import { soundEffects } from '../utils/soundEffects';
import BadgeCard from '../components/BadgeCard';

export default function Result({ navigate }) {
  const { session, restartGame, clearSession } = useGame();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    soundEffects.playVictory();

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    async function fetchResult() {
      if (!session?._id) {
        setLoading(false);
        return;
      }
      try {
        const res = await gameService.getGameResult(session._id);
        if (res.success) {
          setResultData(res.result);
        }
      } catch (err) {
        console.error('Failed to load full result:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [session]);

  const handlePlayAgain = async () => {
    await restartGame();
    navigate('game');
  };

  const handleDashboard = () => {
    clearSession();
    navigate('dashboard');
  };

  const finalScore = resultData?.finalScore ?? session?.score ?? 0;
  const percentage = resultData?.percentage ?? session?.percentage ?? 0;
  const correct = resultData?.correctAnswers ?? session?.correctAnswers ?? 0;
  const incorrect = resultData?.incorrectAnswers ?? session?.wrongAnswers ?? 0;
  const accuracy = resultData?.accuracy ?? Math.round((correct / (correct + incorrect || 1)) * 100);
  const livesRemaining = resultData?.livesRemaining ?? session?.lives ?? 1;
  const badge = resultData?.badge || { title: 'CYBER SMART' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Victory Header (Section 22) */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black shadow-xs">
          <Key className="w-4 h-4 text-emerald-600" />
          <span>ESCAPE ROOM UNLOCKED</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          🎉 ESCAPE COMPLETE!
        </h1>
        <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-lg mx-auto">
          Congratulations! You successfully neutralized the cybersecurity threat vectors and unlocked the exit.
        </p>
      </div>

      {/* Primary Metric Highlights Grid (Section 16 & 22) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cybersecurity Score
          </div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {percentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
            {finalScore} Total Points
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Correct Answers
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {correct} / {correct + incorrect}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Chambers Cleared
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Accuracy Rate
          </div>
          <div className="text-3xl font-black text-indigo-600 mt-1">
            {accuracy}%
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
            Precision Factor
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Lives Remaining
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-rose-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < livesRemaining
                    ? 'fill-rose-500 stroke-rose-500'
                    : 'fill-none stroke-slate-300 opacity-40'
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            {livesRemaining} of 3 Hearts Intact
          </div>
        </div>
      </div>

      {/* Awarded Cybersecurity Badge (Section 22 & 23) */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Awarded Cybersecurity Designation
        </h3>
        <BadgeCard
          badge={badge}
          percentage={percentage}
          showDescription={true}
        />
      </div>

      {/* Strongest & Weakest Category Cards (Section 22 & 24) */}
      {resultData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Strongest Defense Area</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-950">
              {resultData.strongestCategory}
            </div>
            <p className="text-xs text-emerald-800/80 font-medium mt-1">
              You showed exceptional threat recognition and confidence in this cybersecurity domain.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              <span>Needs Improvement</span>
            </div>
            <div className="text-xl font-extrabold text-amber-950">
              {resultData.weakestCategory}
            </div>
            <p className="text-xs text-amber-800/80 font-medium mt-1">
              Focus on this category in your next run to sharpen your detection instincts.
            </p>
          </div>
        </div>
      )}

      {/* Personalized Learning Recommendations (Section 25) */}
      {resultData?.recommendations && resultData.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Personalized Learning Recommendations
          </h3>
          <div className="space-y-2.5">
            {resultData.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 space-y-1"
              >
                <div className="font-bold text-slate-900">{rec.area}</div>
                <div className="text-slate-600">{rec.recommendation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons (Section 22) */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200">
        <button
          onClick={handlePlayAgain}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-sm cursor-pointer transition-transform active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </button>

        <button
          onClick={() => navigate('performance')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          View Performance
        </button>

        <button
          onClick={() => navigate('history')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <History className="w-4 h-4 text-slate-600" />
          View History
        </button>

        <button
          onClick={handleDashboard}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <Home className="w-4 h-4 text-slate-500" />
          Dashboard
        </button>
      </div>
    </div>
  );
}
