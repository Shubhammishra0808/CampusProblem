import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Code,
  BookOpen,
  FileCheck,
  Award,
  PlusCircle,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Zap,
  TrendingUp,
  X
} from 'lucide-react';

const PlacementCenter = () => {
  const { user } = useContext(AuthContext);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('drives'); // 'drives', 'ats', or 'prep'
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // AI Resume ATS Analyzer State
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [analyzingATS, setAnalyzingATS] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  const [newPlacement, setNewPlacement] = useState({
    companyName: '',
    title: '',
    type: 'Placement',
    role: '',
    packageOffered: '',
    stipend: '',
    location: 'Bangalore / Hybrid',
    applicationDeadline: '',
    registrationLink: '',
    description: ''
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchPlacements();
  }, [filterType]);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      let url = `/placements?`;
      if (filterType !== 'All') url += `&type=${filterType}`;
      const res = await api.get(url);
      if (res.data.success) {
        setPlacements(res.data.placements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await api.post('/placements', newPlacement);
      if (res.data.success) {
        setShowModal(false);
        fetchPlacements();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleAnalyzeResume = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setAnalyzingATS(true);

    setTimeout(() => {
      const words = resumeText.toLowerCase();
      let score = 65;
      const matched = [];
      const missing = [];

      const roleKeywords = {
        'Full Stack Developer': ['react', 'node', 'javascript', 'api', 'database', 'git', 'css', 'sql', 'typescript'],
        'Data Scientist / AI Engineer': ['python', 'pandas', 'machine learning', 'tensorflow', 'sql', 'numpy', 'nlp'],
        'Cloud & DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'jenkins'],
        'Cybersecurity Analyst': ['firewall', 'penetration testing', 'wireshark', 'siem', 'cryptography', 'network']
      };

      const expected = roleKeywords[targetRole] || roleKeywords['Full Stack Developer'];

      expected.forEach(k => {
        if (words.includes(k)) {
          matched.push(k);
          score += 4;
        } else {
          missing.push(k);
        }
      });

      if (words.length > 300) score += 5;
      if (score > 98) score = 98;

      setAtsResult({
        score,
        matched,
        missing,
        suggestions: [
          'Quantify your bullet points with measurable impact (e.g. Improved query response time by 40%).',
          `Add missing industry keywords: ${missing.slice(0, 3).join(', ')}.`,
          'Ensure contact details and LinkedIn profile link are in the top header.'
        ]
      });
      setAnalyzingATS(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Career & Recruitment Command
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-600" />
            Training, Placements & Career Acceleration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Campus recruitment drives, internships, AI Resume ATS screening, and interview readiness.
          </p>
        </div>

        {['admin', 'hod', 'faculty'].includes(user?.role) && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        )}
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('drives')}
          className={`pb-3 text-xs font-black transition border-b-2 cursor-pointer ${
            activeTab === 'drives'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Active Recruitment Drives & Internships
        </button>

        <button
          onClick={() => setActiveTab('ats')}
          className={`pb-3 text-xs font-black transition border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ats'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          AI Resume ATS Score Checker
        </button>

        <button
          onClick={() => setActiveTab('prep')}
          className={`pb-3 text-xs font-black transition border-b-2 cursor-pointer ${
            activeTab === 'prep'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Coding & Aptitude Prep Hub
        </button>
      </div>

      {/* TAB 1: DRIVES */}
      {activeTab === 'drives' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {['All', 'Placement', 'Internship'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  filterType === t
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {t === 'All' ? 'All Openings' : `${t} Drives`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              ))}
            </div>
          ) : placements.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
              No placement drives found for this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {placements.map(p => (
                <div
                  key={p._id}
                  className="bg-white dark:bg-[#151e32] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {p.type}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {p.location}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">{p.companyName}</h3>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{p.role || p.title}</p>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Package: {p.packageOffered || p.stipend || 'Competitive'}</span>
                      <span className="text-rose-500 text-[11px]">Due: {p.applicationDeadline ? new Date(p.applicationDeadline).toLocaleDateString() : 'Rolling'}</span>
                    </div>

                    {p.registrationLink ? (
                      <a
                        href={p.registrationLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>Apply on Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold"
                      >
                        Campus Registered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI RESUME ATS ANALYZER */}
      {activeTab === 'ats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                AI Resume Screener
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">Instant ATS Resume & Role Analyzer</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paste your resume text below to calculate your automated ATS match percentage against campus interview standards.
              </p>
            </div>

            <form onSubmit={handleAnalyzeResume} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Job Role</label>
                <select
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Full Stack Developer">Full Stack Developer / Software Engineer</option>
                  <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Resume Text (Copy & Paste)</label>
                <textarea
                  rows={8}
                  required
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your complete resume summary, skills, projects, and work experience here..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={analyzingATS}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{analyzingATS ? 'Calculating ATS Compatibility...' : 'Scan Resume with AI'}</span>
              </button>
            </form>
          </div>

          {/* ATS Results View */}
          <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            {atsResult ? (
              <div className="space-y-5 animate-scale-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-400">Analysis Result</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Target: {targetRole}</span>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 text-center space-y-2 border border-slate-200 dark:border-slate-800">
                  <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400">{atsResult.score}%</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {atsResult.score >= 80 ? '🌟 Excellent ATS Compatibility! Highly Recommended for Shortlist.' : '⚡ Good Base. Requires slight optimization to beat company filters.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Matched Key Technical Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matched.map((m, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>

                {atsResult.missing.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-rose-400 mb-2">Recommended Keywords to Include</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missing.map((m, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold">
                          + {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">AI Optimization Tips</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {atsResult.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume Report Ready to Generate</h3>
                <p className="text-xs max-w-xs">
                  Paste your resume in the editor and click scan to view your ATS score breakdown and keyword suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PREP HUB */}
      {activeTab === 'prep' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Data Structures & Algorithms</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Curated top 150 LeetCode & HackerRank interview questions with step-by-step video solutions.</p>
            <a href="https://leetcode.com/problemset/" target="_blank" rel="noreferrer" className="inline-block text-xs font-bold text-indigo-600 hover:underline">
              Access Problem Set →
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Quantitative & Aptitude</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Speed math shortcuts, logical reasoning mocks, and TCS / Infosys / Accenture sample papers.</p>
            <a href="https://www.indiabix.com/" target="_blank" rel="noreferrer" className="inline-block text-xs font-bold text-amber-600 hover:underline">
              Practice Mock Tests →
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">System Design & HR Rounds</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">STAR behavioral interview question frameworks and high-level architecture templates.</p>
            <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noreferrer" className="inline-block text-xs font-bold text-emerald-600 hover:underline">
              Read Guides →
            </a>
          </div>
        </div>
      )}

      {/* Modal to Post Opportunity */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Post Campus Recruitment Drive</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePlacement} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newPlacement.companyName}
                    onChange={e => setNewPlacement({ ...newPlacement, companyName: e.target.value })}
                    placeholder="e.g. Google / Microsoft"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newPlacement.role}
                    onChange={e => setNewPlacement({ ...newPlacement, role: e.target.value })}
                    placeholder="e.g. Associate Software Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Opportunity Type</label>
                  <select
                    value={newPlacement.type}
                    onChange={e => setNewPlacement({ ...newPlacement, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Placement">Full-Time Placement</option>
                    <option value="Internship">Summer Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Package (CTC / Stipend)</label>
                  <input
                    type="text"
                    value={newPlacement.packageOffered}
                    onChange={e => setNewPlacement({ ...newPlacement, packageOffered: e.target.value })}
                    placeholder="e.g. ₹12.5 LPA or ₹45k/mo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Registration / Application Link</label>
                <input
                  type="url"
                  value={newPlacement.registrationLink}
                  onChange={e => setNewPlacement({ ...newPlacement, registrationLink: e.target.value })}
                  placeholder="https://company.com/careers/job123"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Eligibility Criteria & Description</label>
                <textarea
                  rows={3}
                  required
                  value={newPlacement.description}
                  onChange={e => setNewPlacement({ ...newPlacement, description: e.target.value })}
                  placeholder="B.Tech CS/IT/EC with 7.0+ CGPA, no active backlogs..."
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={posting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md cursor-pointer"
                >
                  {posting ? 'Publishing...' : 'Publish Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PlacementCenter;
