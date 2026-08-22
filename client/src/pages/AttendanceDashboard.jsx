import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  CalendarCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  TrendingUp,
  BarChart3,
  BookOpen,
  Users,
  ShieldCheck,
  Building,
  ArrowRight,
  PlusCircle,
  FileText,
  Lock,
  Layers,
  History,
  Settings,
  Flame,
  X,
  MapPin,
  RefreshCw,
  Award
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AttendanceDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Student State
  const [studentSummary, setStudentSummary] = useState(null);

  // Faculty State
  const [schedule, setSchedule] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrSubjectId, setQrSubjectId] = useState('');
  const [qrDuration, setQrDuration] = useState(5);
  const [activeQRSession, setActiveQRSession] = useState(null);
  const [qrTimeLeft, setQrTimeLeft] = useState(0);

  // Student QR Scan Modal State
  const [showStudentScanModal, setShowStudentScanModal] = useState(false);
  const [scanToken, setScanToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');

  // HOD / Admin State
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'student') {
        const res = await api.get('/attendance/student-summary');
        if (res.data.success) {
          setStudentSummary(res.data.summary);
        }
      } else if (['faculty', 'hod', 'admin'].includes(user?.role)) {
        const [schedRes, analRes] = await Promise.all([
          api.get('/attendance/faculty/schedule'),
          api.get('/attendance/analytics')
        ]);
        if (schedRes.data.success) setSchedule(schedRes.data.schedule || []);
        if (analRes.data.success) setAnalytics(analRes.data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Timer for active QR session countdown
  useEffect(() => {
    let timer;
    if (activeQRSession && qrTimeLeft > 0) {
      timer = setInterval(() => {
        setQrTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQRSession, qrTimeLeft]);

  const handleStartQR = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/attendance/qr/start', {
        subjectId: qrSubjectId,
        durationMinutes: qrDuration
      });
      if (res.data.success) {
        setActiveQRSession(res.data);
        setQrTimeLeft(res.data.durationMinutes * 60);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate QR session');
    }
  };

  const handleEndQR = async () => {
    if (!activeQRSession) return;
    try {
      await api.post('/attendance/qr/end', { sessionId: activeQRSession.sessionId });
      setActiveQRSession(null);
      setShowQRModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStudentVerifyQR = async (e) => {
    e.preventDefault();
    if (!scanToken.trim()) return;
    setScanning(true);
    setScanError('');
    setScanResult(null);

    try {
      // Get browser geolocation if available
      let lat = null;
      let lng = null;
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
          });
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        } catch {}
      }

      const res = await api.post('/attendance/qr/verify', {
        token: scanToken.trim(),
        latitude: lat,
        longitude: lng
      });

      if (res.data.success) {
        setScanResult(res.data);
        setScanToken('');
        fetchDashboardData();
      }
    } catch (err) {
      setScanError(err.response?.data?.message || 'Failed to verify attendance code. Please check session expiry.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Smart Academic Attendance Grid
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <CalendarCheck2 className="w-7 h-7 text-amber-300" />
              Campus Attendance & Academic Engagement
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1">
              Real-time attendance tracking, dynamic 75% shortage forecaster, automated QR check-in, and audit-compliant reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {user?.role === 'student' ? (
              <button
                type="button"
                onClick={() => setShowStudentScanModal(true)}
                className="px-5 py-2.5 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>1-Tap QR Check-In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/attendance/mark"
                  className="px-4 py-2.5 rounded-2xl bg-white text-blue-800 hover:bg-blue-50 font-black text-xs transition flex items-center gap-2 shadow-md"
                >
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span>Mark Class Attendance</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowQRModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Start QR Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Quick Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Link
          to="/attendance"
          className="px-4 py-2 rounded-2xl bg-blue-600 text-white font-black shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </Link>
        <Link
          to="/attendance/history"
          className="px-4 py-2 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <History className="w-3.5 h-3.5 text-blue-500" />
          <span>Timeline & Calendar</span>
        </Link>
        <Link
          to="/attendance/analytics"
          className="px-4 py-2 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Analytics & Prediction</span>
        </Link>
        <Link
          to="/attendance/reports"
          className="px-4 py-2 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-purple-500" />
          <span>Download Reports (CSV)</span>
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/attendance/settings"
            className="px-4 py-2 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:border-blue-500 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            <span>Attendance Policies</span>
          </Link>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ======================= ROLE 1: STUDENT VIEW ============================ */}
      {/* ========================================================================= */}
      {user?.role === 'student' && studentSummary && (
        <div className="space-y-8">
          
          {/* Top Metric Cards Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Overall Attendance */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Overall Attendance</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-4xl font-black ${
                  studentSummary.overallPercentage >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                  studentSummary.overallPercentage >= 75 ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }`}>
                  {studentSummary.overallPercentage}%
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100%</span>
              </div>
              <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${studentSummary.overallPercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${studentSummary.overallPercentage}%` }}
                />
              </div>
            </div>

            {/* Total Classes Stats */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lecture Breakdown</span>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{studentSummary.presentCount}</span>
                  <span className="block text-[9px] font-bold text-emerald-800 dark:text-emerald-300">Present</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                  <span className="text-lg font-black text-rose-600 dark:text-rose-400">{studentSummary.absentCount}</span>
                  <span className="block text-[9px] font-bold text-rose-800 dark:text-rose-300">Absent</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40">
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">{studentSummary.lateCount}</span>
                  <span className="block text-[9px] font-bold text-amber-800 dark:text-amber-300">Late</span>
                </div>
              </div>
            </div>

            {/* Attendance Streak */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Streak</span>
                <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">🔥 {studentSummary.currentStreak} Classes</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Consecutive classes present</p>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Exam Eligibility</span>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase ${
                  studentSummary.overallPercentage >= 75
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 animate-pulse'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {studentSummary.overallPercentage >= 75 ? 'Eligible for End-Sem' : 'Attendance Shortage Warning'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Minimum required: 75%</p>
              </div>
            </div>

          </div>

          {/* Low Attendance Shortage Warning Banner (Dynamic) */}
          {studentSummary.subjectBreakdown.some(s => s.isShortage) && (
            <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 space-y-3 animate-scale-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black">Attendance Shortage Detected</h3>
                  <p className="text-xs text-rose-800 dark:text-rose-300">
                    The following subject(s) are below the mandatory 75% threshold. Take immediate action to avoid academic detention:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {studentSummary.subjectBreakdown.filter(s => s.isShortage).map(s => (
                  <div key={s.subjectId} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 space-y-1">
                    <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase">{s.subjectCode}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.subjectName}</h4>
                    <div className="flex items-center justify-between text-xs font-black pt-1">
                      <span className="text-rose-600">{s.percentage}%</span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400">⚡ Attend next {s.classesNeededToReachTarget} classes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject-Wise Attendance Breakdown Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Subject-Wise Attendance Details</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Per-course class attendance, faculty in-charge, and recovery predictions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentSummary.subjectBreakdown.map(sub => (
                <div
                  key={sub.subjectId}
                  className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {sub.subjectCode}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        sub.percentage >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        sub.percentage >= 75 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {sub.statusLabel}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{sub.subjectName}</h3>
                    <p className="text-[11px] text-slate-400">Faculty: {sub.facultyName}</p>

                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{sub.percentage}%</span>
                      <span className="text-xs text-slate-400">({sub.present} / {sub.total} classes attended)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendation Tag */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {sub.isShortage ? (
                      <p className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                        ⚠️ Attend at least <strong>{sub.classesNeededToReachTarget} more classes</strong> consecutively to recover to 75%.
                      </p>
                    ) : (
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        ✓ Safe margin: You can miss up to <strong>{sub.maxClassesCanMiss} classes</strong> and stay above 75%.
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Attendance Prediction & Forecasting Engine */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-base font-black">AI Attendance Shortage Forecaster</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Based on your historical attendance patterns and remaining curriculum lectures, here are your projected outcomes:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-emerald-300 font-black text-xs uppercase">Scenario A: Attend Next 8 Classes</span>
                <p className="text-slate-200">Your projected overall attendance will increase to <strong className="text-white text-sm">{studentSummary.forecast.ifAttendsNext8}%</strong>.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-rose-300 font-black text-xs uppercase">Scenario B: Miss Next 3 Classes</span>
                <p className="text-slate-200">Your overall attendance will drop down to <strong className="text-white text-sm">{studentSummary.forecast.ifMissesNext3}%</strong>.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ==================== ROLE 2: FACULTY / HOD VIEW ========================= */}
      {/* ========================================================================= */}
      {['faculty', 'hod', 'admin'].includes(user?.role) && (
        <div className="space-y-8">
          
          {/* Faculty Today's Classes List */}
          <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">Timetable Synchronization</span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Today's Teaching Schedule & Attendance Status</h2>
              </div>
              <button
                type="button"
                onClick={fetchDashboardData}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Schedule</span>
              </button>
            </div>

            <div className="space-y-3">
              {schedule.map(item => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-xs shadow-sm">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">{item.lectureSlot}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.roomNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                          Section {item.section}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {item.subject ? item.subject.name : 'Coursework Lecture'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      item.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      item.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse' :
                      'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {item.status === 'COMPLETED' ? '✓ Completed' : item.status === 'IN_PROGRESS' ? '⚡ Active QR Session' : 'Pending Attendance'}
                    </span>

                    <Link
                      to="/attendance/mark"
                      state={{ prefillSubject: item.subject?._id, prefillSection: item.section, prefillSlot: item.lectureSlot }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow"
                    >
                      <span>{item.status === 'COMPLETED' ? 'Review / Edit' : 'Mark Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Attendance Intelligence for HOD / Admin */}
          {analytics && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Department Attendance Analytics ({analytics.department})</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated attendance percentages, low attendance defaulters, and section comparisons</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-400">Department Average</span>
                  <span className="block text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{analytics.averageAttendance}%</span>
                  <span className="text-xs text-slate-400 mt-1 block">Across {analytics.totalSessions} class sessions</span>
                </div>

                <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-400">Total Enrolled Students</span>
                  <span className="block text-4xl font-black text-slate-900 dark:text-white mt-2">{analytics.totalStudents}</span>
                  <span className="text-xs text-slate-400 mt-1 block">Active semester batches</span>
                </div>

                <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-rose-500">Defaulters Below 75%</span>
                  <span className="block text-4xl font-black text-rose-600 dark:text-rose-400 mt-2">{analytics.atRiskCount}</span>
                  <span className="text-xs text-rose-400 mt-1 block">Requires parental notification</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* ================== MODAL: START FACULTY QR SESSION ====================== */}
      {/* ========================================================================= */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">Start Live QR Attendance Session</h2>
              </div>
              <button onClick={() => setShowQRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!activeQRSession ? (
              <form onSubmit={handleStartQR} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Subject</label>
                  <select
                    value={qrSubjectId}
                    onChange={e => setQrSubjectId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="">-- Choose Subject --</option>
                    {schedule.map(s => s.subject && (
                      <option key={s.subject._id} value={s.subject._id}>
                        {s.subject.name} ({s.subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">QR Code Expiry Duration</label>
                  <select
                    value={qrDuration}
                    onChange={e => setQrDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value={3}>3 Minutes (Fast Class)</option>
                    <option value={5}>5 Minutes (Standard)</option>
                    <option value={10}>10 Minutes (Extended)</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-900 dark:text-amber-200 text-xs">
                  🛡️ <strong>Anti-Proxy Protection:</strong> Students can only scan once per device and session tokens expire automatically.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md cursor-pointer"
                  >
                    Broadcast QR Code
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-black uppercase text-amber-500">Live Attendance Session Token</span>
                  <div className="p-4 bg-white rounded-2xl inline-block shadow-md">
                    {/* Simulated visual QR barcode box */}
                    <div className="w-48 h-48 border-4 border-slate-900 rounded-xl flex flex-col items-center justify-center p-3 text-slate-900 font-mono">
                      <QrCode className="w-28 h-28 text-slate-900" />
                      <span className="text-[11px] font-black tracking-widest mt-1">{activeQRSession.token}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span>Time Remaining: <strong className="text-amber-600 text-sm font-mono">{Math.floor(qrTimeLeft / 60)}:{(qrTimeLeft % 60).toString().padStart(2, '0')}</strong></span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleEndQR}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    End & Finalize Session
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ================== MODAL: STUDENT 1-TAP QR SCAN ========================= */}
      {/* ========================================================================= */}
      {showStudentScanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-slate-900 dark:text-white">QR Attendance Check-In</h2>
              </div>
              <button onClick={() => setShowStudentScanModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {scanResult ? (
              <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200">{scanResult.message}</h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Lecture: <strong>{scanResult.subject}</strong> ({scanResult.roomNumber})
                </p>
                <button
                  type="button"
                  onClick={() => { setScanResult(null); setShowStudentScanModal(false); }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleStudentVerifyQR} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Enter Active Lecture Session Code / Scan QR
                  </label>
                  <input
                    type="text"
                    required
                    value={scanToken}
                    onChange={e => setScanToken(e.target.value)}
                    placeholder="e.g. 9b3d1f04..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-center font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {scanError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-700 dark:text-rose-300 font-semibold">
                    {scanError}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>Campus geolocation distance verification enabled.</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStudentScanModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scanning}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md cursor-pointer"
                  >
                    {scanning ? 'Verifying...' : 'Mark Present'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AttendanceDashboard;
