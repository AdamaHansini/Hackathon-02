import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Search, 
  Filter, 
  Check, 
  X, 
  AlertCircle,
  Mail,
  Lock,
  QrCode,
  MessageSquare,
  Power,
  Shield,
  ArrowLeft,
  RefreshCw,
  Terminal,
  Zap,
  Target
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { challengeService } from '../../services/challengeService';

export default function ManageChallenges({ navigate }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiPromptCategory, setAiPromptCategory] = useState('PHISHING');
  const [aiPromptDifficulty, setAiPromptDifficulty] = useState('MEDIUM');
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state for creating and editing challenges
  const [formData, setFormData] = useState({
    title: '',
    category: 'PHISHING',
    scenario: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    warningSigns: '',
    difficulty: 'EASY',
    points: 10,
    active: true
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const res = await challengeService.getAllChallenges({
        category: selectedCategory || undefined
      });
      if (res.success) {
        setChallenges(res.challenges || []);
      }
    } catch (err) {
      showToast('Failed to load challenge database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [selectedCategory]);

  const handleOpenAdd = () => {
    setEditingChallenge(null);
    setFormData({
      title: '',
      category: selectedCategory || 'PHISHING',
      scenario: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      warningSigns: '',
      difficulty: 'EASY',
      points: 10,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ch) => {
    setEditingChallenge(ch);
    setFormData({
      title: ch.title,
      category: ch.category,
      scenario: ch.scenario,
      question: ch.question,
      options: ch.options ? [...ch.options] : ['', '', '', ''],
      correctAnswer: ch.correctAnswer,
      explanation: ch.explanation,
      warningSigns: Array.isArray(ch.warningSigns) ? ch.warningSigns.join(', ') : '',
      difficulty: ch.difficulty,
      points: ch.points || 10,
      active: ch.active !== false
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    setActionLoading(true);
    try {
      const res = await adminService.toggleChallengeActive(id);
      if (res.success) {
        showToast(res.message);
        setChallenges(challenges.map(c => 
          c._id === id ? { ...c, active: res.active } : c
        ));
      } else {
        showToast(res.message || 'Toggle failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Toggle status failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`PERMANENT ACTION: Delete threat challenge "${title}" from the catalog?`)) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminService.deleteChallenge(id);
      if (res.success) {
        showToast(`Challenge deleted successfully`);
        setChallenges(challenges.filter(c => c._id !== id));
      } else {
        showToast(res.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete challenge failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDifficultyChange = (newDiff) => {
    const defaultPts = newDiff === 'HARD' ? 30 : newDiff === 'MEDIUM' ? 20 : 10;
    setFormData(prev => ({
      ...prev,
      difficulty: newDiff,
      points: defaultPts
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.correctAnswer.trim()) {
      showToast('Please specify the exact correct answer', 'error');
      return;
    }

    const filteredOptions = formData.options.filter(o => o.trim() !== '');
    if (filteredOptions.length < 2) {
      showToast('Please provide at least 2 answer choices', 'error');
      return;
    }

    if (!filteredOptions.includes(formData.correctAnswer)) {
      showToast('Correct answer must match one of the provided options exactly', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        ...formData,
        options: filteredOptions,
        warningSigns: formData.warningSigns
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      };

      if (editingChallenge) {
        const res = await adminService.updateChallenge(editingChallenge._id, payload);
        if (res.success) {
          showToast('Cyber challenge updated successfully');
        }
      } else {
        const res = await adminService.createChallenge(payload);
        if (res.success) {
          showToast('New cyber challenge deployed to catalog');
        }
      }

      setIsModalOpen(false);
      loadChallenges();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save challenge failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const res = await adminService.generateAIChallenge({
        category: aiPromptCategory,
        difficulty: aiPromptDifficulty
      });

      if (res.success && res.challenge) {
        const c = res.challenge;
        setEditingChallenge(null);
        setFormData({
          title: c.title,
          category: c.category || aiPromptCategory,
          scenario: c.scenario,
          question: c.question,
          options: c.options || [],
          correctAnswer: c.correctAnswer,
          explanation: c.explanation,
          warningSigns: Array.isArray(c.warningSigns) ? c.warningSigns.join(', ') : '',
          difficulty: c.difficulty || aiPromptDifficulty,
          points: c.points || (aiPromptDifficulty === 'HARD' ? 30 : aiPromptDifficulty === 'MEDIUM' ? 20 : 10),
          active: true
        });
        setIsModalOpen(true);
        showToast('AI synthesized new scenario. Review and save below.');
      } else {
        showToast(res.message || 'AI Generation returned empty result', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'AI generation failed (verify GEMINI_API_KEY)', 'error');
    } finally {
      setGeneratingAI(false);
    }
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

  const filtered = challenges.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.scenario?.toLowerCase().includes(search.toLowerCase()) ||
      c.question?.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'ACTIVE') return matchesSearch && c.active !== false;
    if (statusFilter === 'INACTIVE') return matchesSearch && c.active === false;
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Floating Toast */}
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
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>THREAT_INVENTORY // ESCAPE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Challenge & Threat Scenario Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Create, edit, activate/deactivate, and calibrate difficulty and points across all escape room chambers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Center</span>
          </button>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateAI}
            disabled={generatingAI}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            {generatingAI ? 'Synthesizing with Gemini...' : 'AI Generate Scenario'}
          </button>

          {/* Manual Create Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Challenge</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scenario description, title, or question keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-700"
        >
          <option value="">All Categories ({challenges.length})</option>
          <option value="PHISHING">Phishing Vectors</option>
          <option value="PASSWORD">Password Entropy</option>
          <option value="FAKE_QR">Fake QR Scenarios</option>
          <option value="SCAM_MESSAGE">Scam Messages</option>
        </select>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('INACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'INACTIVE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Deactivated
          </button>
        </div>
      </div>

      {/* Challenges Catalog Table */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-mono text-xs">
          Loading threat catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-700">No threat challenges match your criteria.</p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800"
          >
            Create New Threat
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-5">Threat Challenge</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Points</th>
                  <th className="py-3.5 px-4">Status & Toggle</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((ch) => {
                  const Icon = getCategoryIcon(ch.category);
                  const isActive = ch.active !== false;

                  return (
                    <tr key={ch._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 max-w-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate" title={ch.title}>
                              {ch.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate" title={ch.scenario}>
                              {ch.scenario}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                          {ch.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                          ch.difficulty === 'HARD'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : ch.difficulty === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {ch.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {ch.points || 10} pts
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(ch._id, isActive)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                            isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                          }`}
                          title={isActive ? 'Click to Deactivate' : 'Click to Activate'}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{isActive ? 'ACTIVE' : 'DEACTIVATED'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(ch)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                          title="Edit Challenge"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(ch._id, ch.title)}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Challenge"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Challenge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {editingChallenge ? 'UPDATE_RECORD // ID: ' + editingChallenge._id : 'NEW_CYBER_VECTOR // CATALOG_INGEST'}
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {editingChallenge ? 'Edit Threat Scenario' : 'Create Cybersecurity Challenge'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-mono">
              {/* Challenge Title */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Threat Scenario Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Forged Cloud Provider MFA Token Request"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Category, Difficulty, Points, and Active State */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white"
                  >
                    <option value="PHISHING">PHISHING</option>
                    <option value="PASSWORD">PASSWORD</option>
                    <option value="FAKE_QR">FAKE_QR</option>
                    <option value="SCAM_MESSAGE">SCAM_MESSAGE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold bg-white"
                  >
                    <option value="EASY">EASY (10 pts)</option>
                    <option value="MEDIUM">MEDIUM (20 pts)</option>
                    <option value="HARD">HARD (30 pts)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Points *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Active State
                  </label>
                  <div className="pt-1.5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="challenge-active-toggle"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded text-slate-900 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="challenge-active-toggle" className="font-bold text-slate-700 text-xs cursor-pointer">
                      {formData.active ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Scenario Narrative */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Scenario Narrative (Inspection environment) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.scenario}
                  onChange={(e) => setFormData({ ...formData, scenario: e.target.value })}
                  placeholder="Describe the incident narrative: e.g. You receive an urgent email from sec-support@pay-pal-alert.co requesting immediate verification..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium font-sans"
                />
              </div>

              {/* Decision Question */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Cadet Decision Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What is the safest immediate defensive action?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold"
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Answer Options (provide 2 to 4 choices) *
                </label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 text-center font-bold text-slate-400">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...formData.options];
                        newOpts[i] = e.target.value;
                        setFormData({ ...formData, options: newOpts });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-sans"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer Selector / Exact Match */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Exact Correct Answer *
                </label>
                <input
                  type="text"
                  required
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder="Paste or select the exact option that neutralizes the threat"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-emerald-950 font-bold font-sans"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] text-slate-400 mr-1">Quick Select:</span>
                  {formData.options.filter(Boolean).map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 font-medium"
                    >
                      Option {String.fromCharCode(65 + idx)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Educational Explanation */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Cybersecurity Educational Debrief / Explanation *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this defensive move is correct and identify the exact vulnerability..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-sans"
                />
              </div>

              {/* Warning Signs */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Warning Signs / Red Flags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.warningSigns}
                  onChange={(e) => setFormData({ ...formData, warningSigns: e.target.value })}
                  placeholder="e.g. Typosquatted domain, Artificial urgency, Shortened URL redirection"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-sans"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 rounded-xl text-white bg-slate-900 hover:bg-slate-800 font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{editingChallenge ? 'Save Changes' : 'Deploy Challenge'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
