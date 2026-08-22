import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileText,
  Bell,
  BookOpen,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Wifi,
  Zap,
  Droplets,
  Utensils,
  Laptop,
  Search,
  CheckCircle,
  Volume2,
  VolumeX,
  Building,
  Bus,
  Shield,
  Eye,
  Lock,
  X,
  Megaphone,
  QrCode,
  Calendar,
  CalendarCheck2,
  Trophy,
  Award,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Bot,
  Compass,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import Heatmap from '../components/Heatmap';

const StudentHome = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrgentModal, setActiveUrgentModal] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Quick Ticket Search State
  const [quickTicketId, setQuickTicketId] = useState('');
  const [quickResult, setQuickResult] = useState(null);
  const [quickSearching, setQuickSearching] = useState(false);
  const [quickError, setQuickError] = useState('');

  // Daily Campus Menu & Bus Live Widget State
  const [activeServiceTab, setActiveServiceTab] = useState('mess');
  const [messVotes, setMessVotes] = useState({ breakfast: 24, lunch: 48, dinner: 19 });
  const [votedMeals, setVotedMeals] = useState({});

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [compRes, noticeRes, attRes] = await Promise.all([
        api.get('/complaints?my=true'),
        api.get('/notices'),
        api.get('/attendance/student-summary')
      ]);

      if (compRes.data?.success) setComplaints(compRes.data.complaints);
      if (attRes.data?.success) setAttendanceSummary(attRes.data.summary);
      if (noticeRes.data?.success && noticeRes.data.notices.length > 0) {
        setNotices(noticeRes.data.notices);
        const urgentNotice = noticeRes.data.notices.find(
          n => n.priority === 'Urgent' || n.priority === 'Important'
        );
        const dismissedUrgentId = sessionStorage.getItem('dismissed_urgent_notice');
        if (urgentNotice && dismissedUrgentId !== urgentNotice._id) {
          setActiveUrgentModal(urgentNotice);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (e) => {
    e.preventDefault();
    if (!quickTicketId.trim()) return;

    setQuickSearching(true);
    setQuickError('');
    setQuickResult(null);

    try {
      const res = await api.get(`/complaints/track/${quickTicketId.trim()}`);
      if (res.data.success) {
        setQuickResult(res.data);
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || `Ticket #${quickTicketId.trim().toUpperCase()} not found or private.`);
    } finally {
      setQuickSearching(false);
    }
  };

  // Text-To-Speech for Official Campus Broadcasts
  const handleSpeakNotice = (noticeText) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(noticeText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDismissModal = () => {
    if (activeUrgentModal) {
      sessionStorage.setItem('dismissed_urgent_notice', activeUrgentModal._id);
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setActiveUrgentModal(null);
  };

  const handleVoteMeal = (meal, type) => {
    if (votedMeals[meal]) return;
    setMessVotes(prev => ({
      ...prev,
      [meal]: type === 'up' ? prev[meal] + 1 : Math.max(0, prev[meal] - 1)
    }));
    setVotedMeals(prev => ({ ...prev, [meal]: type }));
  };

  const pendingCount = complaints.filter(c => ['NEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(c.status)).length;

  // Chart data calculations
  const categoryCountMap = complaints.reduce((acc, curr) => {
    const cat = curr.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryCountMap).length > 0
    ? Object.keys(categoryCountMap).map(k => ({ name: k, value: categoryCountMap[k] }))
    : [
        { name: 'Electrical & Power', value: 4 },
        { name: 'Internet/Wi-Fi', value: 3 },
        { name: 'Water & Plumbing', value: 2 },
        { name: 'Smart Class', value: 2 },
        { name: 'Hostel/Mess', value: 1 }
      ];

  const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  // Latest Upper-Level Notice for Top Broadcast
  const topBroadcastNotice = notices[0] || {
    title: 'Campus Wi-Fi Upgrade Scheduled for Hostel Wings & Central Library',
    content: 'High-speed Wi-Fi 6 access points are being configured across hostel wings to eliminate packet loss and boost speed.',
    issuingAuthority: 'Office of IT & Network Infrastructure',
    category: 'Infrastructure',
    priority: 'Important',
    createdAt: new Date().toISOString()
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* ================= 1. OFFICIAL UPPER-LEVEL BROADCAST DIRECT ALERT ================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-900 p-4 sm:p-5 text-white shadow-xl shadow-rose-500/10 border border-white/20 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 shadow-inner">
              <Megaphone className="w-5 h-5 animate-pulse text-amber-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                  {topBroadcastNotice.priority === 'Urgent' ? '⚠️ URGENT BROADCAST' : '🏛️ OFFICIAL DISPATCH'}
                </span>
                <span className="text-[11px] font-bold text-amber-200">
                  {topBroadcastNotice.issuingAuthority || 'Campus Administration'}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black text-white truncate">
                {topBroadcastNotice.title}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                {topBroadcastNotice.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button
              onClick={() => handleSpeakNotice(`${topBroadcastNotice.title}. ${topBroadcastNotice.content}`)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md border border-white/20"
              title="Listen to Audio Broadcast"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              <span>{isSpeaking ? 'Mute' : 'Listen'}</span>
            </button>
            <Link
              to="/notices"
              className="px-4 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-amber-50 text-xs font-black transition flex items-center gap-1.5 shadow-sm"
            >
              <span>View All Notices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 2. HERO STUDENT WELCOME BANNER ================= */}
      <div className="relative bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-brand-500/20 overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {getGreeting()} • Smart Campus Problem Solver
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-[11px] font-extrabold">
              <CheckCircle2 className="w-3 h-3" /> Verified Student
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-300/30 text-[11px] font-extrabold">
              <Lock className="w-3 h-3 text-amber-300" /> Private Grievance Vault Active
            </span>
          </div>

          {/* User Name */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Welcome, <span className="text-amber-300 drop-shadow-md underline decoration-amber-400 decoration-4">{user?.name}</span>! 👋
          </h1>

          {/* Student Profile Identity Tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-brand-100 text-xs sm:text-sm mt-3 font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              {user?.department || 'Computer Science & Engineering'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Roll No: <span className="font-extrabold text-white">{user?.rollNumber || '22CS045'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              {user?.hostelBlock ? `Residence: ${user.hostelBlock} (${user.roomNumber || 'Room 302'})` : 'Day Scholar'}
            </span>
          </div>

          {/* Quick Primary Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/complaints/new"
              className="px-5 py-3 rounded-2xl bg-white text-brand-700 hover:bg-brand-50 text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2 group cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-brand-600 group-hover:rotate-90 transition-transform" />
              <span>Report Campus Grievance</span>
            </Link>

            <Link
              to="/complaints/my"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>My Grievance Vault ({complaints.length})</span>
            </Link>

            <Link
              to="/qr-report"
              className="px-5 py-3 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-900" />
              <span>1-Tap QR Scan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 3. GAMIFIED CIVIC XP & CAMPUS HEALTH BAR ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Civic XP Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Civic Karma Rank
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Level 3 Guardian
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">480 XP</span>
              <span className="text-[11px] text-slate-400 font-bold">Next Level: 600 XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-1.5">
              <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          <span className="text-[10px] text-slate-400">
            🌟 Earn +50 XP for every resolved grievance verification!
          </span>
        </div>

        {/* AI Campus Health Status */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Campus Health Index
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Optimal (96.8%)
            </span>
          </div>

          <div className="my-1.5 flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                <span>Power &amp; HVAC</span>
                <span className="text-emerald-500">99%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99%' }}></div>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold text-slate-700 dark:text-slate-300">
                <span>Wi-Fi &amp; Labs</span>
                <span className="text-blue-500">94%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            ⚡ Avg response turnaround: <strong>1.8 Hours</strong>
          </span>
        </div>

        {/* AI Quick Diagnostic Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-brand-200 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-white" /> AI Copilot Diagnostic
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
              Instant
            </span>
          </div>

          <p className="text-xs text-white/90 font-bold my-1">
            Need urgent fix or attendance medical leave recommendation?
          </p>

          <Link
            to="/complaints/new"
            className="w-full py-2 rounded-xl bg-white text-brand-700 hover:bg-brand-50 text-xs font-black text-center transition shadow-sm"
          >
            Launch AI Symptom Checker →
          </Link>
        </div>
      </div>

      {/* ================= 4. METRICS CARDS GRID ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{complaints.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">My Submissions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{pendingCount}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Active / In Progress</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{resolvedCount}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Resolved Fixed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-inner">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{notices.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Official Notices</span>
          </div>
        </div>
      </div>

      {/* ================= 5. SMART ACADEMIC ATTENDANCE LIVE WIDGET ================= */}
      {attendanceSummary && (
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Live Academic Attendance &amp; 75% Tracker
              </h3>
            </div>
            <Link
              to="/attendance"
              className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Open Full Attendance Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Percentage Ring Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400">Overall Attendance</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-black ${
                    attendanceSummary.overallPercentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    attendanceSummary.overallPercentage >= 75 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {attendanceSummary.overallPercentage}%
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ 100%</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  {attendanceSummary.presentCount} Attended • {attendanceSummary.absentCount} Missed
                </span>
              </div>

              <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                attendanceSummary.overallPercentage >= 75 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
              }`}>
                {attendanceSummary.overallPercentage >= 75 ? '✓ Safe' : '⚠ Shortage'}
              </div>
            </div>

            {/* Quick Subjects Preview */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {attendanceSummary.subjectBreakdown?.slice(0, 4).map(sub => (
                <div key={sub.subjectId} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[10px] font-black text-slate-500 truncate">{sub.subjectCode}</span>
                  <span className={`text-lg font-black my-0.5 ${
                    sub.percentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    sub.percentage >= 75 ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {sub.percentage}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 truncate">{sub.subjectName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. RECHARTS CATEGORY DONUT & STATUS INSIGHTS ================= */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Campus Issue Category Distribution &amp; Turnaround
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Live Real-time Analytics</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Departmental Resolution SLA
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">⚡ Electrical Substation Crew</span>
                <span className="font-black text-emerald-500">45 Mins Avg</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">🌐 IT Computer Center NetOps</span>
                <span className="font-black text-blue-500">1.2 Hours Avg</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">🚿 Hydraulics &amp; Plumbing Crew</span>
                <span className="font-black text-amber-500">2.1 Hours Avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 7. CAMPUS SERVICES: MESS MENU & SHUTTLE BUS ================= */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Campus Daily Services &amp; Live Schedules
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveServiceTab('mess')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${activeServiceTab === 'mess' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              🍽️ Mess Today's Menu &amp; Rating
            </button>
            <button
              onClick={() => setActiveServiceTab('bus')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${activeServiceTab === 'bus' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              🚌 Campus Shuttle GPS Tracker
            </button>
          </div>
        </div>

        {activeServiceTab === 'mess' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase block">Breakfast (7:30 AM - 9:30 AM)</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-1">Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs &amp; Tea/Coffee</p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200">{messVotes.breakfast} Student Upvotes</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVoteMeal('breakfast', 'up')}
                    className={`p-1 rounded-lg transition ${votedMeals.breakfast === 'up' ? 'bg-emerald-500 text-white' : 'bg-amber-200/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'}`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleVoteMeal('breakfast', 'down')}
                    className={`p-1 rounded-lg transition ${votedMeals.breakfast === 'down' ? 'bg-rose-500 text-white' : 'bg-amber-200/50 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'}`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 uppercase block">Lunch (12:30 PM - 2:30 PM)</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-1">Paneer Butter Masala / Chicken Curry, Dal Tadka, Jeera Rice, Chapati &amp; Gulab Jamun</p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-200">{messVotes.lunch} Student Upvotes</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVoteMeal('lunch', 'up')}
                    className={`p-1 rounded-lg transition ${votedMeals.lunch === 'up' ? 'bg-emerald-500 text-white' : 'bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'}`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleVoteMeal('lunch', 'down')}
                    className={`p-1 rounded-lg transition ${votedMeals.lunch === 'down' ? 'bg-rose-500 text-white' : 'bg-emerald-200/50 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'}`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 uppercase block">Dinner (7:30 PM - 9:30 PM)</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-1">Veg Pulao, Aloo Gobi Masala, Dal Fry, Roti &amp; Seasonal Fruit Custard</p>
              </div>
              <div className="mt-3 pt-2 border-t border-purple-200 dark:border-purple-900/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-800 dark:text-purple-200">{messVotes.dinner} Student Upvotes</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleVoteMeal('dinner', 'up')}
                    className={`p-1 rounded-lg transition ${votedMeals.dinner === 'up' ? 'bg-emerald-500 text-white' : 'bg-purple-200/50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'}`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleVoteMeal('dinner', 'down')}
                    className={`p-1 rounded-lg transition ${votedMeals.dinner === 'down' ? 'bg-rose-500 text-white' : 'bg-purple-200/50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200'}`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <Bus className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">Route 1: Metro Station Express</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Departs every 20 mins (Next in 12 mins)</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">On Time</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <Bus className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">Route 2: City Center / Hostels</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Departs every 30 mins (Next in 06 mins)</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Active</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <Bus className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 dark:text-white block">Route 3: South Campus Shuttle</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Continuous 10 min loop (Next in 03 mins)</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Operational</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 8. QUICK TICKET SEARCH LOOKUP WIDGET ================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl space-y-4 border border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Quick Ticket ID Status Lookup (Encrypted)
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">Track real-time technician notes &amp; resolution status instantly by Ticket ID.</p>
        </div>

        <form onSubmit={handleQuickSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">#</span>
            <input
              type="text"
              required
              value={quickTicketId}
              onChange={e => setQuickTicketId(e.target.value)}
              placeholder="e.g. CFX-1002"
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <button
            type="submit"
            disabled={quickSearching}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md"
          >
            {quickSearching ? 'Searching...' : 'Lookup Ticket'}
          </button>
        </form>

        {quickError && (
          <p className="text-xs text-rose-300 font-bold">{quickError}</p>
        )}

        {quickResult && (
          <div className="mt-3 p-4 rounded-2xl bg-white/10 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-scale-in">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-300 text-xs">#{quickResult.complaint.ticketId}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase">
                  {quickResult.complaint.status}
                </span>
              </div>
              <p className="text-xs font-black text-white mt-1">{quickResult.complaint.title}</p>
              <p className="text-[11px] text-slate-300">{quickResult.complaint.building} • {quickResult.complaint.roomNumber}</p>
            </div>

            <Link
              to={`/complaints/${quickResult.complaint._id}`}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black transition inline-flex items-center gap-1.5 flex-shrink-0"
            >
              <span>View Full Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* ================= 9. MAIN BENTO GRID: HEATMAP + SUBMISSIONS + ACADEMIC HUB ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Problem Heatmap & Active Complaints */}
        <div className="lg:col-span-2 space-y-6">
          <Heatmap />

          {/* Active Submissions */}
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  My Private Grievances (Visible to You &amp; Admin Only)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct status tracking with assigned campus technician</p>
              </div>
              <Link to="/complaints/my" className="text-xs font-black text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p>No active grievances registered in your account.</p>
                <Link to="/complaints/new" className="inline-block text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                  Click here to report an infrastructure problem
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {complaints.slice(0, 4).map(c => (
                  <ComplaintCard key={c._id} complaint={c} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Academic & Career Hub + Notices */}
        <div className="space-y-6">
          
          {/* Quick Hub Navigation Cards */}
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Campus Academic &amp; Career Hub
            </h3>

            <Link
              to="/resources"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition">Study Notes &amp; PYQs</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Semester 1-8 syllabus resources</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/placements"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition">Placements &amp; Internships</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Campus drives &amp; ATS Resume tools</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/lost-found"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-200 dark:border-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition">Lost &amp; Found Hub</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Match &amp; Verified Claiming</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* College Notices Widget */}
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Official Campus Notices
              </h3>
              <Link to="/notices" className="text-xs font-black text-brand-600 dark:text-brand-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map(notice => (
                <div
                  key={notice._id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 transition"
                >
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-500 dark:text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 uppercase">
                      {notice.issuingAuthority || notice.category}
                    </span>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">{notice.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= 10. UNREAD URGENT NOTICE POPUP MODAL ================= */}
      {activeUrgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-rose-500 max-w-lg w-full space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
                  ⚠️ URGENT ADMINISTRATION NOTICE
                </span>
              </div>
              <button
                onClick={handleDismissModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400 uppercase">
                {activeUrgentModal.issuingAuthority || 'Office of the Dean'}
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {activeUrgentModal.title}
              </h2>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              {activeUrgentModal.content}
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleSpeakNotice(`${activeUrgentModal.title}. ${activeUrgentModal.content}`)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-500" /> : <Volume2 className="w-4 h-4 text-brand-500" />}
                <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
              </button>

              <button
                onClick={handleDismissModal}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black transition shadow-md cursor-pointer"
              >
                I Acknowledge &amp; Understand
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentHome;
