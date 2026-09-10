import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Key, 
  Terminal, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  Layers,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

export default function CyberInspector({ challenge, onUseHint }) {
  const [activeTab, setActiveTab] = useState('raw');
  const [showHint, setShowHint] = useState(false);
  const [showHeaders, setShowHeaders] = useState(false);
  const [activeLinkHover, setActiveLinkHover] = useState(false);
  const [qrDecoded, setQrDecoded] = useState(false);
  const [customPassword, setCustomPassword] = useState('');

  if (!challenge) return null;

  const { category, scenario, warningSigns = [] } = challenge;

  const toggleHint = () => {
    soundEffects.playHint();
    setShowHint(!showHint);
    if (!showHint && onUseHint) {
      onUseHint();
    }
  };

  // Extract or simulate links inside scenario
  const hasUrgentWords = /urgent|immediately|action required|suspended|freeze|expire/i.test(scenario);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white overflow-hidden shadow-sm">
      {/* Inspector Toolbar Header */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Cyber Analyst HUD
          </span>
          <span className="text-slate-500">• Forensic Inspection Tools</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleHint}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              showHint
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showHint ? 'Hide Analyst Clue' : 'Request Tactical Clue'}
          </button>
        </div>
      </div>

      {/* Tactical Clue Card when toggled */}
      {showHint && (
        <div className="bg-amber-950/40 border-b border-amber-500/30 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <span>Tactical Analyst Tip</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-200">
                  Forensic Insight
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {warningSigns && warningSigns.length > 0
                  ? `Pay attention to: "${warningSigns[0]}". Scrutinize the domain discrepancies and artificial pressure.`
                  : 'Scrutinize subtle cues: verify if the actual domain matches the real organization, and question forced deadlines.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Category-Specific Advanced Forensic Controls */}
      <div className="p-4 space-y-4">
        {/* 1. PHISHING INSPECTOR */}
        {category === 'PHISHING' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSelect();
                  setShowHeaders(!showHeaders);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  showHeaders
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                {showHeaders ? 'Hide Raw Email Headers' : 'Inspect SPF/DKIM Email Headers'}
              </button>

              <button
                type="button"
                onMouseEnter={() => setActiveLinkHover(true)}
                onMouseLeave={() => setActiveLinkHover(false)}
                onClick={() => {
                  soundEffects.playSelect();
                  setActiveLinkHover(!activeLinkHover);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeLinkHover
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {activeLinkHover ? 'Link Inspector: ACTIVE' : 'Hover / Inspect Hidden Link Target'}
              </button>
            </div>

            {/* Email Headers Modal / Panel */}
            {showHeaders && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300 animate-in fade-in">
                <div className="text-xs font-bold text-indigo-400 flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>RAW MIME HEADERS:</span>
                  <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                    SPOOF DETECTED
                  </span>
                </div>
                <div><span className="text-slate-500">Authentication-Results:</span> spf=softfail; dkim=none</div>
                <div><span className="text-slate-500">Return-Path:</span> &lt;bounce-relay@external-malicious-server.ru&gt;</div>
                <div><span className="text-slate-500">X-Originating-IP:</span> 185.220.101.42 (Anonymous Proxy/Tor Exit)</div>
                <div><span className="text-slate-500">X-Mailer:</span> PHPMailer 6.2.0 (Automated Mass Dispatch)</div>
              </div>
            )}

            {/* Deceptive Link Inspection Hover Warning */}
            {activeLinkHover && (
              <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-xl text-xs space-y-1 animate-in fade-in">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>URL Destination Mismatch Analysis:</span>
                </div>
                <div className="font-mono text-[11px] space-y-1">
                  <div className="text-slate-300">
                    Visible Anchor Text: <span className="text-emerald-400">https://login.company.com/verify</span>
                  </div>
                  <div className="text-rose-400 font-bold">
                    Actual Network Target: <span className="bg-rose-900/60 px-1.5 py-0.5 rounded">http://comp-any-sec-update.xyz/credential-harvest.php</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. PASSWORD INSPECTOR */}
        {category === 'PASSWORD' && (
          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Cpu className="w-3.5 h-3.5" /> Brute-Force Cracking Speed Benchmark
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  Hashcat Benchmark
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Simple / Dictionary (8 chars)</div>
                  <div className="text-rose-400 font-extrabold text-sm mt-0.5">&lt; 1 Second</div>
                  <div className="text-[10px] text-slate-500">Rainbow table instant match</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Mixed Case + Digits (10 chars)</div>
                  <div className="text-amber-400 font-extrabold text-sm mt-0.5">~3 Weeks</div>
                  <div className="text-[10px] text-slate-500">Vulnerable to GPU rigs</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold">Passphrase (16+ chars phrase)</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-0.5">300+ Trillion Years</div>
                  <div className="text-[10px] text-slate-500">Mathematically unbreakable</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. FAKE QR INSPECTOR */}
        {category === 'FAKE_QR' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSelect();
                  setQrDecoded(!qrDecoded);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  qrDecoded
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                {qrDecoded ? 'Reset QR Lens' : 'Activate Optical Tamper Lens'}
              </button>
              <span className="text-[10px] text-slate-400">Click to decode physical sticker</span>
            </div>

            {qrDecoded && (
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 text-xs font-mono space-y-1.5 animate-in fade-in">
                <div className="text-amber-400 font-bold flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>OPTICAL SCAN DIAGNOSTIC:</span>
                  <span className="text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded text-[10px]">
                    PHYSICAL STICKER OVERLAY DETECTED
                  </span>
                </div>
                <div><span className="text-slate-500">Decoded Payload:</span> http://quick-pay-parking.online/pay?id=8492</div>
                <div><span className="text-slate-500">SSL Certificate:</span> None (Insecure HTTP Plaintext)</div>
                <div><span className="text-slate-500">Legitimate City Domain:</span> https://cityofmetropolis.gov/parking</div>
                <div className="text-amber-300 font-sans text-[11px] pt-1 border-t border-slate-800">
                  ⚠️ Alert: Visual inspection shows physical sticker edges pasted over the real metallic parking terminal plate!
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. SCAM SMS MESSAGE INSPECTOR */}
        {category === 'SCAM_MESSAGE' && (
          <div className="space-y-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-indigo-400 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> SMS Threat Vector Analysis
                </span>
                <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                  SMISHING RISK: HIGH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300 pt-1">
                <div>Sender ID: <span className="text-rose-400">Spoofed / Random VoIP</span></div>
                <div>Urgency Score: <span className="text-rose-400">{hasUrgentWords ? '98% (Panic Driver)' : '65%'}</span></div>
                <div>Link Redirection: <span className="text-rose-400">Suspicious Shortlink</span></div>
                <div>Bank Brand Match: <span className="text-amber-400">Unverified Source</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
