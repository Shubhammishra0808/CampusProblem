import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Bell,
  PlusCircle,
  FileText,
  Briefcase,
  Users,
  GraduationCap,
  Sparkles,
  ClipboardList,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Upload,
  Calendar,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import Heatmap from '../components/Heatmap';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const [compRes, noticeRes, resRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/notices'),
        api.get('/resources')
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (noticeRes.data.success) setNotices(noticeRes.data.notices.slice(0, 4));
      if (resRes.data.success) setResources(resRes.data.resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const myDeptComplaints = complaints.filter(
    c => c.department === user?.department || c.building?.includes('Block A') || c.category === 'Classroom'
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HUGE BOLD FACULTY / HOD BANNER */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-emerald-500/15 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 flex items-center pointer-events-none">
          <GraduationCap className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Faculty & Academic Leadership Desk
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/25 text-emerald-200 border border-emerald-300/30 text-[11px] font-extrabold uppercase">
              {user?.role === 'hod' ? 'Head of Department' : 'Faculty Member'}
            </span>
          </div>

          {/* BIG BOLD NAME */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Welcome, <span className="text-amber-300 drop-shadow-md underline decoration-amber-400 decoration-4">{user?.name}</span>! 🎓
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-emerald-100 text-xs sm:text-sm mt-3 font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              {user?.department}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Employee ID: <span className="font-extrabold text-white">{user?.employeeId || 'FAC-101'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Office: <span className="font-extrabold text-white">{user?.officeLocation || 'Block A - 201'}</span>
            </span>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/resources"
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Upload Class Notes & Syllabus</span>
            </Link>

            <Link
              to="/notices"
              className="px-5 py-3 rounded-2xl bg-emerald-500/30 hover:bg-emerald-500/45 text-white border border-emerald-300/40 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-white" />
              <span>Broadcast Department Notice</span>
            </Link>

            <Link
              to="/complaints/new"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Report Classroom Projector / AC</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{resources.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Study Resources</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{myDeptComplaints.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Department Tickets</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{notices.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Published Notices</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Active</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Academic Status</span>
          </div>
        </div>
      </div>

      {/* Heatmap & Department Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Heatmap />

          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Department Infrastructure Tickets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Classroom, Lab, and Faculty wing maintenance items</p>
              </div>
              <Link to="/admin/complaints" className="text-xs font-black text-emerald-600 hover:underline">
                View Full Log
              </Link>
            </div>

            {loading ? (
              <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            ) : myDeptComplaints.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                No active complaints reported in your department wing.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myDeptComplaints.slice(0, 4).map(c => (
                  <ComplaintCard key={c._id} complaint={c} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notices & Directory */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Latest Notices
              </h3>
              <Link to="/notices" className="text-xs font-black text-emerald-600 hover:underline">
                Broadcast New
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map(notice => (
                <div key={notice._id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">
                    {notice.category}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">{notice.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Faculty Shortcuts
            </h3>
            <Link
              to="/faculty-directory"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Inter-Department Directory</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/placements"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-800 transition"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Placement & Internship Drives</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FacultyDashboard;
