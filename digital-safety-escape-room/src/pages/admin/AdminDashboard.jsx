import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Gamepad2, 
  CheckCircle2, 
  Award, 
  FileQuestion, 
  TrendingDown, 
  AlertTriangle,
  Plus, 
  Sparkles,
  BarChart3,
  ArrowUpRight,
  Activity,
  Terminal,
  RefreshCw,
  Cpu,
  Lock,
  Mail,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboard({ navigate }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await adminService.getAnalytics();
      if (res.success) {
        setStats(res.analytics || res.stats);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'PHISHING': return Mail;
      case 'PASSWORD': return Lock;
      case 'FAKE_QR': return QrCode;
      case 'SCAM_MESSAGE': return MessageSquare;
      default: return Terminal;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-mono text-xs">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-wider">Connecting to Cyber Incident SOC...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top SOC Status Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOC_NODE_01 // ROOT ADMINISTRATOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Cyber Threat Command Center
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Supervise live escape runs, audit category vulnerability rates, and configure active threat challenges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('admin-challenges')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <FileQuestion className="w-4 h-4 text-emerald-400" />
            Manage Challenges
          </button>

          <button
            onClick={() => navigate('admin-users')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-600" />
            Manage Users
          </button>
        </div>
      </div>

      {/* Primary Game Statistics KPI Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Game Telemetry & Operations Statistics</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">STATUS: AUTHORIZED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Cadets
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {stats?.totalAdmins || 1} Admins in Root
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Escape Runs
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {stats?.gamesPlayed || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Total initiated
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Escapes Made
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {stats?.gamesCompleted || 0}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Passed all stages
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Compromised
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1">
              {stats?.gamesFailed || 0}
            </div>
            <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
              Lost all 3 lives
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Escape Success Rate
            </div>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {stats?.completionRate || 0}%
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Avg score: {stats?.averageScore || 0} pts
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Active Threats
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {stats?.activeChallenges || 0}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              of {stats?.totalChallenges || 0} in catalog
            </div>
          </div>
        </div>
      </div>

      {/* Threat Diagnostics: Most Difficult Category & Most Missed Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10">
            <ShieldAlert className="w-24 h-24 text-rose-400" />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold border border-rose-500/30">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>HIGHEST CADET VULNERABILITY VECTOR</span>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {stats?.mostDifficultCategory || 'PHISHING'}
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1 leading-relaxed">
                Cadets demonstrate the highest rate of deceptive trap clicks and life loss in this attack surface.
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800 flex items-center justify-between">
              <span>EXPLOIT STATUS: ELEVATED RISK</span>
              <button
                onClick={() => navigate('admin-challenges')}
                className="text-emerald-400 hover:underline font-bold"
              >
                Inspect Scenarios →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-mono font-bold border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>MOST FREQUENTLY MISSED CHALLENGE</span>
          </div>

          <div>
            <div className="text-lg font-black text-slate-900 line-clamp-1">
              {stats?.mostMissedChallenge?.title || 'None recorded yet'}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Triggered {stats?.mostMissedChallenge?.missCount || 0} incorrect decisions resulting in life loss.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] text-slate-500">
              Category: <span className="font-bold text-slate-800">{stats?.mostMissedChallenge?.category || 'PHISHING'}</span>
            </span>
            <button
              onClick={() => navigate('admin-challenges')}
              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Review in Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown Matrix */}
      {stats?.categoryPerformance && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>Threat Category Performance Matrix</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluates cadet decision accuracy, attempt volumes, and systemic vulnerability levels per vector.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                SECURE &gt; 85%
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                MODERATE 65-85%
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                CRITICAL &lt; 65%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats.categoryPerformance).map(([catKey, data]) => {
              const Icon = getCategoryIcon(catKey);
              const accuracy = data.successRate ?? 100;
              const isCritical = accuracy < 65;
              const isModerate = accuracy >= 65 && accuracy < 85;

              return (
                <div 
                  key={catKey}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        isCritical 
                          ? 'bg-rose-100 text-rose-800 border-rose-200' 
                          : isModerate 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {data.threatLevel || (isCritical ? 'CRITICAL RISK' : isModerate ? 'MODERATE RISK' : 'SECURE')}
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wide">
                      {data.label || catKey.replace('_', ' ')}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        {accuracy}%
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        accuracy
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          isCritical ? 'bg-rose-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                    <span>{data.attempts || 0} Total Tests</span>
                    <span className="text-emerald-700 font-bold">{data.correct || 0} Safe</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Action Navigation Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('admin-challenges')}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileQuestion className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Challenge Threat Catalog
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Create, edit, delete, or activate/deactivate challenges and set points.
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </div>

        <div 
          onClick={() => navigate('admin-users')}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Cadet Roster & Performance
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Audit individual user performance, manage roles, or reset cadet stats.
              </p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </div>
      </div>
    </div>
  );
}
