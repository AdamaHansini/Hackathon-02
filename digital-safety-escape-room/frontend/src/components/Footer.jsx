import React from 'react';
import { Shield, Lock, Terminal, Info } from 'lucide-react';

export default function Footer({ navigate, currentRoute }) {
  if (currentRoute === 'game') return null;
  return (
    <footer className="border-t border-slate-200 bg-white py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">
              DIGITAL SAFETY ESCAPE ROOM
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive Cybersecurity Gamification • Phishing, Password, QR & Scam Defense
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-600">
          <button onClick={() => navigate('instructions')} className="hover:text-slate-900">
            Game Rules
          </button>
          <button onClick={() => navigate('leaderboard')} className="hover:text-slate-900">
            Leaderboard
          </button>
          <button onClick={() => navigate('performance')} className="hover:text-slate-900">
            Threat Analytics
          </button>
          <button onClick={() => navigate('dashboard')} className="hover:text-slate-900">
            Dashboard
          </button>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-400">
          <div>Built for Cyber Safety Awareness</div>
          <div className="flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Escape Room Active & Armed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
