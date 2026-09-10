import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Shield, 
  Search, 
  Eye, 
  RotateCcw, 
  Trash2, 
  UserCheck, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Clock,
  ArrowLeft,
  Mail,
  Lock,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function ManageUsers({ navigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Performance Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfData, setPerfData] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      showToast('Failed to retrieve cadet records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenPerformance = async (user) => {
    setSelectedUser(user);
    setPerfLoading(true);
    setPerfData(null);
    try {
      const res = await adminService.getUserPerformance(user._id);
      if (res.success) {
        setPerfData(res);
      } else {
        showToast(res.message || 'Could not load dossier', 'error');
      }
    } catch (err) {
      showToast('Failed to load cadet performance dossier', 'error');
    } finally {
      setPerfLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMsg = newRole === 'admin' 
      ? `Promote ${user.name} to Root Administrator?` 
      : `Demote ${user.name} to Standard Cadet?`;
    
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      const res = await adminService.updateUserRole(user._id, newRole);
      if (res.success) {
        showToast(res.message);
        setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
      } else {
        showToast(res.message || 'Failed to update role', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Role change failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetStats = async (user) => {
    if (!window.confirm(`Are you sure you want to reset all telemetry and challenge records for cadet ${user.name}? This cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminService.resetUserStats(user._id);
      if (res.success) {
        showToast(`Reset stats for ${user.name}`);
        loadUsers();
        if (selectedUser && selectedUser._id === user._id) {
          handleOpenPerformance(user);
        }
      } else {
        showToast(res.message || 'Failed to reset stats', 'error');
      }
    } catch (err) {
      showToast('Reset failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`PERMANENT ACTION: Delete cadet profile ${user.name} (${user.email})?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminService.deleteUser(user._id);
      if (res.success) {
        showToast(`Cadet ${user.name} decommissioned`);
        setUsers(users.filter(u => u._id !== user._id));
        if (selectedUser && selectedUser._id === user._id) {
          setSelectedUser(null);
        }
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete cadet failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchQuery = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    if (roleFilter === 'ADMINS') return matchQuery && u.role === 'admin';
    if (roleFilter === 'CADETS') return matchQuery && u.role !== 'admin';
    return matchQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-mono font-bold flex items-center gap-2 ${
          toast.type === 'error' 
            ? 'bg-rose-950 text-rose-200 border-rose-800' 
            : 'bg-slate-900 text-emerald-400 border-slate-800'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold shadow-xs">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>PERSONNEL_MGMT // ACTIVE ROSTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Cadet Personnel Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Supervise cadet readiness, inspect historical simulation runs, manage role clearances, or purge compromised profiles.
          </p>
        </div>

        <button
          onClick={() => navigate('admin')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Admin Command Center</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cadet name, callsign, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              roleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Personnel ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('CADETS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              roleFilter === 'CADETS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Cadets ({users.filter(u => u.role !== 'admin').length})
          </button>
          <button
            onClick={() => setRoleFilter('ADMINS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              roleFilter === 'ADMINS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Admins ({users.filter(u => u.role === 'admin').length})
          </button>
        </div>
      </div>

      {/* Personnel Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-mono text-xs">
          Loading cadet roster telemetry...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No personnel found matching filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Cadet Identity</th>
                  <th className="py-3.5 px-4">Clearance</th>
                  <th className="py-3.5 px-4">Runs</th>
                  <th className="py-3.5 px-4">Escaped</th>
                  <th className="py-3.5 px-4">Best Score</th>
                  <th className="py-3.5 px-4">Accuracy</th>
                  <th className="py-3.5 px-5 text-right">Actions & Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.role === 'admin' && (
                          <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        u.role === 'admin' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role === 'admin' ? 'ROOT_ADMIN' : 'CADET'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {u.gamesPlayed || 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      {u.gamesCompleted || 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {u.bestScore || 0} pts
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      {u.accuracy || 0}%
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenPerformance(u)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="View User Performance Dossier"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Dossier</span>
                        </button>

                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={actionLoading || u.email === 'admin@gmail.com' || u.email === 'admin@example.com'}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-30 cursor-pointer"
                          title={u.role === 'admin' ? 'Demote to Cadet' : 'Promote to Root Admin'}
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleResetStats(u)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 cursor-pointer"
                          title="Reset Telemetry & Stats"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={actionLoading || u.email === 'admin@gmail.com' || u.email === 'admin@example.com'}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-30 cursor-pointer"
                          title="Decommission Cadet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Performance Dossier Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-emerald-400">
                    CADET DOSSIER
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedUser.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {selectedUser.name}
                </h2>
                <p className="text-xs font-mono text-slate-400">{selectedUser.email}</p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {perfLoading ? (
              <div className="py-12 text-center text-slate-400 font-mono text-xs">
                Decrypting simulation telemetry...
              </div>
            ) : perfData ? (
              <div className="space-y-6">
                {/* Quick Scorecard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block">TOTAL RUNS</span>
                    <span className="text-xl font-black text-slate-900">{perfData.user?.gamesPlayed || 0}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block">ESCAPES</span>
                    <span className="text-xl font-black text-emerald-600">{perfData.user?.gamesCompleted || 0}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block">BEST SCORE</span>
                    <span className="text-xl font-black text-amber-500">{perfData.user?.bestScore || 0} pts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-mono text-slate-400 block">ACCURACY</span>
                    <span className="text-xl font-black text-indigo-600">{perfData.performance?.overallAccuracy || 0}%</span>
                  </div>
                </div>

                {/* Category Performance Breakdown */}
                {perfData.performance?.categoryBreakdown && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                      Threat Chamber Accuracy Breakdown
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(perfData.performance.categoryBreakdown).map(([cat, data]) => {
                        const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                        return (
                          <div key={cat} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-slate-800">{cat.replace('_', ' ')}</span>
                              <span className="font-mono font-bold text-slate-900">{acc}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${acc >= 80 ? 'bg-emerald-500' : acc >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${acc}%` }}
                              />
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                              <span>{data.correct} correct</span>
                              <span>{data.total} encountered</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Game Runs */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    Recent Simulation Sessions
                  </h3>
                  {perfData.recentSessions && perfData.recentSessions.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {perfData.recentSessions.map((session, idx) => (
                        <div 
                          key={session.id || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-mono"
                        >
                          <div className="flex items-center gap-2">
                            {session.status === 'COMPLETED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500" />
                            )}
                            <div>
                              <div className="font-bold text-slate-800">
                                {session.status === 'COMPLETED' ? 'VAULT BREACH ESCAPED' : 'SYSTEM LOCKOUT / DEFEATED'}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {session.completedAt ? new Date(session.completedAt).toLocaleString() : 'In Progress'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-slate-900">{session.score || 0} pts</div>
                            <div className="text-[10px] text-slate-400">{session.timeSpent || 0}s elapsed</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-mono italic">No recorded simulation sessions yet.</p>
                  )}
                </div>

                {/* Cadet Administrative Controls */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleResetStats(selectedUser)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Telemetry</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRole(selectedUser)}
                      disabled={selectedUser.email === 'admin@gmail.com' || selectedUser.email === 'admin@example.com'}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 disabled:opacity-30"
                    >
                      {selectedUser.role === 'admin' ? 'Demote to Cadet' : 'Promote to Admin'}
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-500 font-mono">Dossier unavailable.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
