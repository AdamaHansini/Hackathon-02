import React from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  QrCode, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Play, 
  BookOpen, 
  Sparkles,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function Home({ navigate }) {
  const { isAuthenticated, user, login } = useAuth();
  const { startNewGame } = useGame();

  const handleQuickPlay = async () => {
    if (isAuthenticated) {
      await startNewGame();
      navigate('game');
    } else {
      navigate('login');
    }
  };

  const handleDemoLogin = async (email, password) => {
    try {
      await login(email, password);
      navigate('dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  const challengeCategories = [
    {
      title: 'Phishing Vectors',
      desc: 'Detect spoofed sender domains, forged SSL certificates, panic-inducing urgency, and deceptive credential harvester portals.',
      icon: Mail,
      tag: 'Phishing Defense',
      technique: 'MITRE T1566.002',
      vector: 'Domain Spoofing & Harvesters',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Password Entropy',
      desc: 'Master cryptographic entropy, defend against Hashcat brute-force dictionaries, and implement hardware multi-factor tokens.',
      icon: Lock,
      tag: 'Entropy & MFA',
      technique: 'MITRE T1110.001',
      vector: 'Credential Stuffing & Rainbow Tables',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: 'Quishing Tampering',
      desc: 'Identify physical parking meter sticker overlays, rogue Wi-Fi access point captive portals, and quishing redirection exploits.',
      icon: QrCode,
      tag: 'Physical & Digital QR',
      technique: 'MITRE T1204.001',
      vector: 'Physical Sticker & URI Overlay',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Smishing Incidents',
      desc: 'Neutralize fake bank fraud alerts, task advance-fee scams, OTP interception attempts, and emergency imposter communications.',
      icon: MessageSquare,
      tag: 'Smishing Defense',
      technique: 'MITRE T1598',
      vector: 'SMS Spoofing & Urgency Coercion',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-14 max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-xs">
          <Key className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Cybersecurity Gamification</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
          DIGITAL SAFETY <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
            ESCAPE ROOM
          </span>
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-slate-700 italic">
          "Learn Cyber Safety. Play. Decide. Escape."
        </p>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          A gamified cybersecurity awareness experience where you analyze real-world digital threats,
          protect your lives, and make the safest decisions to unlock the exit door.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleQuickPlay}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer border border-emerald-500/30 group"
          >
            <Play className="w-4 h-4 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{isAuthenticated ? 'Enter Escape Room' : 'Initiate Cyber Defense'}</span>
          </button>

          <button
            onClick={() => navigate('instructions')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            Threat Protocol Manual
          </button>

          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate('login')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cadet Login
              </button>
              <button
                onClick={() => navigate('register')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
              >
                Enroll Cadet
              </button>
            </>
          )}
        </div>

        {/* Live Cyber Threat Incident Telemetry Bar */}
        <div className="pt-4 max-w-2xl mx-auto">
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 border border-slate-800 shadow-inner font-mono text-xs text-left space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SOC THREAT SIMULATION FEED</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider">DEFCON 2 // REAL-TIME</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">VECTORS</span>
                <span className="text-emerald-400 font-bold">Phishing & QR</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DIFFICULTY</span>
                <span className="text-amber-400 font-bold">Tier 1-3 Scaled</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">LIFE SYSTEM</span>
                <span className="text-rose-400 font-bold">3 Integrity Cores</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">EXIT PROTOCOL</span>
                <span className="text-indigo-400 font-bold">Master Vault Key</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Challenge Types Section (Section 6) */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Four Threat Defense Chambers
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Each chamber tests a different digital vector in realistic simulations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {challengeCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {cat.technique}
                    </span>
                  </div>
                  <div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${cat.color}`}>
                      {cat.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                      {cat.title}
                    </h3>
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-slate-400">
                    Vector: {cat.vector}
                  </div>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Active Sandbox
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Cybersecurity Awareness Matters (Section 6) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Real-World Impact</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why Cybersecurity Awareness Matters
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              Over 90% of security breaches start not with sophisticated zero-day code exploits,
              but with human manipulation: fraudulent SMS texts, counterfeit QR codes, reused passwords,
              and urgent phishing emails.
            </p>
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
              By training inside simulated real-world scenarios, you build instinctive pattern recognition
              that protects your identities, financial accounts, and digital privacy.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-emerald-400">91%</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Breaches Target People</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-amber-400">3.4B</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Phishing Emails Sent Daily</div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl font-black text-indigo-400">100%</div>
                <div className="text-xs text-slate-400 font-medium mt-1">Defensible With Awareness</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
