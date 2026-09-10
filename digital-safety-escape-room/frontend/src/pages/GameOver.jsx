import React, { useEffect } from 'react';
import { ShieldAlert, RotateCcw, Home, XCircle, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEffects } from '../utils/soundEffects';

export default function GameOver({ navigate }) {
  const { session, restartGame, clearSession } = useGame();

  useEffect(() => {
    soundEffects.playGameOver();
  }, []);

  const handleRestart = async () => {
    soundEffects.playSelect();
    await restartGame();
    navigate('game');
  };

  const handleDashboard = () => {
    clearSession();
    navigate('dashboard');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-lg p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-rose-600">
            System Locked Down
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            GAME OVER
          </h1>
          <p className="text-xs font-medium text-slate-500">
            All 3 lives were depleted before breaching the security exit door.
          </p>
        </div>

        {/* Breakdown Stats (Section 18) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-left">
          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Final Score
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {session?.score || 0}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Chambers Cleared
            </div>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {session?.currentChallengeIndex || 0} / {session?.totalChallenges || 4}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Correct Answers
            </div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">
              {session?.correctAnswers || 0}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-100">
            <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              Wrong Answers
            </div>
            <div className="text-xl font-black text-rose-600 mt-0.5">
              {session?.wrongAnswers || 3}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleRestart}
            className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Escape Room
          </button>

          <button
            onClick={handleDashboard}
            className="w-full py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
