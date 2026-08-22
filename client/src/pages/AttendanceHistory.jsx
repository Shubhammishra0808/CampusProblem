import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  History,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

const AttendanceHistory = () => {
  const { user } = useContext(AuthContext);

  const [viewMode, setViewMode] = useState('calendar'); // 'timeline' | 'calendar'
  const [records, setRecords] = useState([]);
  const [calendarData, setCalendarData] = useState(null);
  const [subjects, setSubjects] = useState([]);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (viewMode === 'timeline') {
      fetchTimeline();
    } else {
      fetchCalendar();
    }
  }, [viewMode, selectedSubject, selectedStatus, currentMonth, currentYear]);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/attendance/subjects');
      if (res.data.success) setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/attendance/history?subjectId=${selectedSubject}&status=${selectedStatus}`);
      if (res.data.success) setRecords(res.data.records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/attendance/calendar?year=${currentYear}&month=${currentMonth}`);
      if (res.data.success) setCalendarData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link to="/attendance" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Attendance Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Attendance Timeline & Monthly Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit-grade history of every lecture, presence timestamps, and monthly attendance tracking.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 ${
              viewMode === 'calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Monthly Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-xl font-black transition flex items-center gap-1.5 ${
              viewMode === 'timeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Chronological Timeline</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ========================== VIEW 1: MONTHLY CALENDAR ===================== */}
      {/* ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                {monthNames[currentMonth - 1]} {currentYear}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (currentMonth === 1) {
                    setCurrentMonth(12);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentMonth === 12) {
                    setCurrentMonth(1);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> 🟢 Present</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> 🔴 Absent</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" /> 🟡 Partial / Late</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" /> ⚪ Holiday / No Class</span>
          </div>

          {/* 7-Days Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} className="text-[11px] font-black uppercase text-slate-400 pb-2">
                {day}
              </span>
            ))}

            {calendarData?.days?.map(cd => {
              const status = cd.statusSummary;
              const hasClasses = cd.records.length > 0;

              return (
                <div
                  key={cd.day}
                  className={`min-h-[85px] p-2 rounded-2xl border text-left flex flex-col justify-between transition ${
                    status === 'ALL_PRESENT' ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60' :
                    status === 'ALL_ABSENT' ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60' :
                    status === 'PARTIAL' ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60' :
                    'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">{cd.day}</span>
                    {hasClasses && (
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        status === 'ALL_PRESENT' ? 'bg-emerald-500' :
                        status === 'ALL_ABSENT' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} />
                    )}
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {cd.records.slice(0, 2).map((r, idx) => (
                      <span
                        key={idx}
                        className={`block text-[9px] font-bold truncate px-1 rounded ${
                          r.status === 'PRESENT' ? 'text-emerald-700 bg-emerald-100/60 dark:text-emerald-300 dark:bg-emerald-950/60' :
                          r.status === 'ABSENT' ? 'text-rose-700 bg-rose-100/60 dark:text-rose-300 dark:bg-rose-950/60' :
                          'text-amber-700 bg-amber-100/60 dark:text-amber-300 dark:bg-amber-950/60'
                        }`}
                      >
                        {r.subject?.code || 'CLASS'}: {r.status}
                      </span>
                    ))}
                    {cd.records.length > 2 && (
                      <span className="text-[9px] font-bold text-slate-400">+{cd.records.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ========================= VIEW 2: TIMELINE LIST ========================= */}
      {/* ========================================================================= */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#151e32] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Filter By:</span>
            </div>

            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="All">All Subjects</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="ON_DUTY">On Duty</option>
            </select>
          </div>

          {/* Timeline Records List */}
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading timeline...</div>
            ) : records.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#151e32] rounded-3xl">
                No attendance records found matching filters.
              </div>
            ) : (
              records.map(rec => (
                <div
                  key={rec._id}
                  className="bg-white dark:bg-[#151e32] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${
                      rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      rec.status === 'ABSENT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {rec.status === 'PRESENT' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {new Date(rec.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {rec.subject?.code}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {rec.subject?.name || 'Class Lecture'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Marked by Prof. {rec.faculty?.name} • Method: {rec.markedVia}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      rec.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      rec.status === 'ABSENT' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default AttendanceHistory;
