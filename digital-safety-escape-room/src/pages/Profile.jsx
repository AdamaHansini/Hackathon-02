import React, { useState, useEffect } from 'react';
import { User, Award, Shield, Key, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import BadgeCard from '../components/BadgeCard';
import AchievementCard from '../components/AchievementCard';

export default function Profile({ navigate }) {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await userService.getProfile();
        if (res.success) {
          setProfileData(res.user);
          setName(res.user.name);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await userService.updateProfile({ name });
      if (res.success) {
        setMsg('Profile name updated successfully.');
        refreshUser();
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const currentBadge = user?.badges && user.badges.length > 0
    ? user.badges[user.badges.length - 1]
    : 'CYBER BEGINNER';

  const allPossibleAchievements = [
    { code: 'PHISHING_HUNTER', name: 'Phishing Hunter', description: 'Identify 5 phishing attempts correctly.', icon: 'Fish' },
    { code: 'PASSWORD_GUARDIAN', name: 'Password Guardian', description: 'Correctly answer 5 password challenges.', icon: 'Lock' },
    { code: 'QR_DETECTIVE', name: 'QR Detective', description: 'Correctly identify 5 suspicious QR scenarios.', icon: 'QrCode' },
    { code: 'SCAM_SPOTTER', name: 'Scam Spotter', description: 'Correctly identify 5 scam messages.', icon: 'MessageSquareWarning' },
    { code: 'CYBER_SAFETY_EXPERT', name: 'Cyber Safety Expert', description: 'Achieve 76% or higher on an escape room run.', icon: 'Award' },
    { code: 'FLAWLESS_ESCAPE', name: 'Flawless Escape', description: 'Escape without losing any lives (3/3 hearts intact).', icon: 'ShieldCheck' },
    { code: 'FIRST_ESCAPE', name: 'Escape Artist', description: 'Successfully unlock and escape the digital safety room.', icon: 'Key' }
  ];

  const earnedCodes = new Set(user?.achievements || []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Cadet Dossier & Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Review your credentials, earned cybersecurity badges, and escape achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Edit Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-base">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold text-slate-900">{user?.name}</div>
              <div className="text-xs text-slate-400">{user?.email}</div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          {msg && (
            <div className="p-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
              {msg}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Badge & Achievements */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Active Cybersecurity Badge
            </h3>
            <BadgeCard
              badge={currentBadge}
              percentage={user?.accuracy || 0}
              showDescription={true}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Escape Room Achievements ({user?.achievements?.length || 0} of {allPossibleAchievements.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allPossibleAchievements.map((ach) => (
                <AchievementCard
                  key={ach.code}
                  name={ach.name}
                  description={ach.description}
                  icon={ach.icon}
                  isUnlocked={earnedCodes.has(ach.code)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
