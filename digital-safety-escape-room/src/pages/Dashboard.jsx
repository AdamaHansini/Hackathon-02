import React, { useEffect, useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Trophy, 
  History, 
  BarChart3, 
  User, 
  ShieldCheck, 
  Award, 
  Zap, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import BadgeCard from '../components/BadgeCard';
import AchievementCard from '../components/AchievementCard';

export default function Dashboard({ navigate }) {
  const { user, refreshUser } = useAuth();
  const { startNewGame, resumeGame, activeSessionAvailable } = useGame();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  const handleStartGame = async () => {
    setStarting(true);
    try {
      await startNewGame(4);
      navigate('game');
    } finally {
      setStarting(false);
    }
  };

  const handleResumeGame = async () => {
    setStarting(true);
    try {
      await resumeGame();
      navigate('game');
    } finally {
      setStarting(false);
    }
  };

  const currentBadge = user?.badges && user.badges.length > 0
    ? user.badges[user.badges.length - 1]
    : 'CYBER BEGINNER';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <Key className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ready for Escape Mission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Cadet'}!
          </h1>
          <p className="text-sm font-medium text-slate-500">
            The Digital Safety Escape Room is armed. Test your defenses, protect your 3 lives, and escape.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {activeSessionAvailable && (
            <button
              onClick={handleResumeGame}
              disabled={starting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-xs transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Continue Active Run
            </button>
          )}

          <button
            onClick={handleStartGame}
            disabled={starting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            {starting ? 'Booting Room...' : 'Start New Escape Room'}
          </button>
        </div>
      </div>

      {/* Stats Cards (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Games Played
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {user?.gamesPlayed || 0}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Total attempts initiated
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Escapes Unlocked
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {user?.gamesCompleted || 0}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Chambers fully escaped
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Best Score
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-2">
            {user?.bestScore || 0}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Peak performance run
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Score
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">
            {user?.averageScore || 0}
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Across all attempts
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Accuracy Rate
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {user?.accuracy || 0}%
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-1">
            Overall decision precision
          </div>
        </div>
      </div>

      {/* Middle Section: Current Badge & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Badge & Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Current Cybersecurity Badge
            </h2>
            <button
              onClick={() => navigate('performance')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <BadgeCard
            badge={currentBadge}
            percentage={user?.accuracy || 0}
            showDescription={true}
          />

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => navigate('history')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left transition-all hover:shadow-xs group"
            >
              <History className="w-5 h-5 text-slate-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-slate-900">Game History</div>
              <div className="text-xs text-slate-500 mt-0.5">Review previous room logs</div>
            </button>

            <button
              onClick={() => navigate('performance')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left transition-all hover:shadow-xs group"
            >
              <BarChart3 className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-slate-900">My Performance</div>
              <div className="text-xs text-slate-500 mt-0.5">Weakest & strongest areas</div>
            </button>

            <button
              onClick={() => navigate('leaderboard')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 text-left transition-all hover:shadow-xs group"
            >
              <Trophy className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-slate-900">Leaderboard</div>
              <div className="text-xs text-slate-500 mt-0.5">Compare scores with others</div>
            </button>
          </div>
        </div>

        {/* Right Col: Achievements Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Achievements
            </h2>
            <button
              onClick={() => navigate('profile')}
              className="text-xs font-bold text-slate-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            <AchievementCard
              name="Phishing Hunter"
              description="Identify 5 phishing attempts correctly."
              icon="Fish"
              isUnlocked={user?.achievements?.includes('PHISHING_HUNTER')}
            />
            <AchievementCard
              name="Password Guardian"
              description="Correctly answer 5 password challenges."
              icon="Lock"
              isUnlocked={user?.achievements?.includes('PASSWORD_GUARDIAN')}
            />
            <AchievementCard
              name="Flawless Escape"
              description="Escape without losing any lives (3/3 hearts intact)."
              icon="ShieldCheck"
              isUnlocked={user?.achievements?.includes('FLAWLESS_ESCAPE')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
