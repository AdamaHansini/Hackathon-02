import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Award, Heart, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { userService } from '../services/userService';

export default function History({ navigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await userService.getHistory();
        if (res.success) {
          setHistory(res.history || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Escape Room Mission History
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Historical logs of all your attempted cybersecurity escape runs.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading history logs...</div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <HistoryIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Mission Logs Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't completed any escape room attempts yet. Start your first mission to track your stats.
          </p>
          <button
            onClick={() => navigate('dashboard')}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Correct</th>
                  <th className="py-3.5 px-4">Accuracy</th>
                  <th className="py-3.5 px-5">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {history.map((run, idx) => {
                  const isCompleted = run.status === 'COMPLETED';
                  const dateStr = run.date ? new Date(run.date).toLocaleDateString() : 'Recent';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {dateStr}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {run.score} pts
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCompleted ? 'Escaped' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {run.correctAnswers} / {run.correctAnswers + run.wrongAnswers}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {run.percentage}%
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          <Award className="w-3 h-3 text-amber-500" />
                          {run.badge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
