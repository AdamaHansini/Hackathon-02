import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Shield, User } from 'lucide-react';
import { userService } from '../services/userService';

export default function Leaderboard({ navigate }) {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await userService.getLeaderboard();
        if (res.success) {
          setBoard(res.leaderboard || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>Hall of Cyber Defenders</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          CYBERSECURITY LEADERBOARD
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Top performers ranked by peak escape room score and defensive accuracy.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading top agents...</div>
      ) : board.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No ranked users yet.</p>
          <p className="text-xs text-slate-400 mt-1">Complete an escape room to claim the #1 spot!</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {board.map((item) => {
              const isTop3 = item.rank <= 3;
              const rankColor = item.rank === 1
                ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-200'
                : item.rank === 2
                ? 'bg-slate-300 text-slate-900 font-bold'
                : item.rank === 3
                ? 'bg-amber-700 text-white font-bold'
                : 'bg-slate-100 text-slate-600 font-semibold';

              return (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${rankColor}`}
                    >
                      {item.rank}
                    </span>

                    <div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {item.name}
                        {item.rank === 1 && (
                          <Medal className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        Badge: {item.badge}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">
                      {item.bestScore} pts
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600">
                      {item.accuracy}% Accuracy
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
