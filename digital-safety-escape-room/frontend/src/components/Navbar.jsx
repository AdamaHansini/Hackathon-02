import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Key, Award, Trophy, History, BarChart3, User, LogOut, Menu, X, Settings, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundEffects } from '../utils/soundEffects';

export default function Navbar({ currentRoute, navigate }) {
  if (currentRoute === 'game') return null;
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());

  useEffect(() => {
    return soundEffects.subscribe((muted) => setIsMuted(muted));
  }, []);

  const handleNav = (route) => {
    navigate(route);
    setMobileOpen(false);
  };

  const toggleSound = () => {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
    if (!next) {
      soundEffects.playSelect();
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                DIGITAL SAFETY
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  ESCAPE ROOM
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Interactive Cybersecurity Defense
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === 'dashboard'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('instructions')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === 'instructions'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Rules
                </button>
                <button
                  onClick={() => handleNav('leaderboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute === 'leaderboard'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Leaderboard
                </button>
                <button
                  onClick={() => handleNav('performance')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute === 'performance'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  Analytics
                </button>
                <button
                  onClick={() => handleNav('history')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentRoute === 'history'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <History className="w-4 h-4 text-slate-500" />
                  History
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentRoute.startsWith('admin')
                        ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300'
                        : 'text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    <Settings className="w-4 h-4 text-amber-600" />
                    Admin Panel
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('instructions')}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                >
                  How to Play
                </button>
              </>
            )}
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Audio SFX Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className={`p-2 rounded-lg transition-colors border ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name || 'Cadet'}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">
                      {user?.role === 'admin' ? 'Admin' : 'Escaper'}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    logout();
                    handleNav('home');
                  }}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="py-2 px-3 mb-2 bg-slate-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNav('instructions')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Rules
              </button>
              <button
                onClick={() => handleNav('leaderboard')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Leaderboard
              </button>
              <button
                onClick={() => handleNav('performance')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Analytics
              </button>
              <button
                onClick={() => handleNav('history')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                History
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Profile & Achievements
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100"
                >
                  Admin Panel
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  handleNav('home');
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('instructions')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                How to Play
              </button>
              <button
                onClick={() => handleNav('login')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Log In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800"
              >
                Register
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
