import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Users,
  Building,
  Layers,
  Award,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

const AttendanceAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [department]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/attendance/analytics?department=${department}`);
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

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
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            Smart Attendance Analytics & Performance Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real data-driven student engagement rates, section comparisons, and shortage predictions.
          </p>
        </div>

        {/* Department Switcher */}
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151e32] text-xs font-black shadow-sm"
        >
          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
          <option value="Electronics & Communication">Electronics & Communication</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Aggregating attendance analytics...</div>
      ) : !analytics ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-[#151e32] rounded-3xl">
          No analytics data available for selected department.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400">Average Attendance Rate</span>
              <span className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{analytics.averageAttendance}%</span>
              <span className="text-xs text-slate-400 mt-1">Across all lecture sessions</span>
            </div>

            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400">Active Student Cohort</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white mt-2">{analytics.totalStudents}</span>
              <span className="text-xs text-slate-400 mt-1">Enrolled in {analytics.department}</span>
            </div>

            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase text-rose-500">Shortage Defaulters</span>
              <span className="text-4xl font-black text-rose-600 dark:text-rose-400 mt-2">{analytics.atRiskCount}</span>
              <span className="text-xs text-rose-400 mt-1">Below mandatory 75% threshold</span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Subject-Wise Attendance (Bar Chart) */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span>Subject Attendance Rates (%)</span>
                </h3>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.subjectBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="attendance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Semester Comparison (Bar Chart) */}
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>Semester-Wise Attendance Comparison</span>
                </h3>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.semesterData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="attendance" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Level 10: Smart Data-Based Insights Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-base font-black">Level 10: Smart Attendance Insights & Actionable Counsel</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
              {analytics.insights?.map((ins, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <span className="text-[10px] font-black text-amber-300 block mb-1 uppercase">Insight #{idx + 1}</span>
                  <p className="text-slate-200">{ins}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shortage Defaulters Table */}
          {analytics.atRiskStudents && analytics.atRiskStudents.length > 0 && (
            <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Students Requiring Counseling ({analytics.atRiskStudents.length} Defaulters)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Roll Number</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Classes Attended</th>
                      <th className="pb-3">Attendance %</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                    {analytics.atRiskStudents.map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                        <td className="py-3 font-mono font-bold text-slate-500">{st.rollNumber || 'STU-001'}</td>
                        <td className="py-3 text-slate-900 dark:text-white font-bold">{st.name}</td>
                        <td className="py-3 text-slate-500">{st.present} / {st.total}</td>
                        <td className="py-3 font-black text-rose-600">{st.percentage}%</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                            Critical Alert
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AttendanceAnalytics;
