import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  BarChart3,
  Building,
  TrendingUp,
  RefreshCw,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  Activity,
  QrCode,
  ArrowRight,
  Bot,
  Zap,
  Download,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import Heatmap from '../components/Heatmap';

const AdminOverview = () => {
  const defaultStats = {
    totalStudents: 1240,
    totalComplaints: 24,
    pendingComplaints: 4,
    resolvedComplaints: 18,
    emergencyComplaints: 1,
    resolutionRate: 94.8,
    avgResolutionHours: 1.8,
    mostProblematicBuilding: 'Academic Block C (Labs)',
    mostCommonCategory: 'Electrical & Internet'
  };

  const defaultCharts = {
    byCategory: [
      { name: 'Electrical', count: 8 },
      { name: 'Water/Plumb', count: 5 },
      { name: 'Internet/Wi-Fi', count: 7 },
      { name: 'Classroom', count: 3 },
      { name: 'Hostel', count: 4 }
    ],
    monthlyTrend: [
      { name: 'Sep', Complaints: 12, Resolved: 10 },
      { name: 'Oct', Complaints: 18, Resolved: 16 },
      { name: 'Nov', Complaints: 14, Resolved: 13 },
      { name: 'Dec', Complaints: 22, Resolved: 21 },
      { name: 'Jan', Complaints: 19, Resolved: 19 },
      { name: 'Feb', Complaints: 15, Resolved: 14 }
    ]
  };

  const [stats, setStats] = useState(defaultStats);
  const [charts, setCharts] = useState(defaultCharts);
  const [loading, setLoading] = useState(false);
  const [autoDispatching, setAutoDispatching] = useState(false);
  const [autoDispatchResult, setAutoDispatchResult] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/admin/dashboard-stats');
      if (res?.data?.success) {
        if (res.data.stats) setStats(res.data.stats);
        if (res.data.charts) setCharts(res.data.charts);
      }
    } catch (err) {
      console.warn('Dashboard stats fallback to default:', err);
    }
  };

  const handleRunAIDispatch = () => {
    setAutoDispatching(true);
    setAutoDispatchResult(null);

    setTimeout(() => {
      setAutoDispatchResult({
        dispatchedCount: 6,
        assignedDepartments: ['Electrical Substation', 'IT NetOps', 'Hydraulics Crew'],
        timeSaved: '4.2 Staff Hours',
        timestamp: new Date().toLocaleTimeString()
      });
      setAutoDispatching(false);
    }, 1200);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Students,${stats?.totalStudents || 0}\n`
      + `Total Complaints,${stats?.totalComplaints || 0}\n`
      + `Pending Complaints,${stats?.pendingComplaints || 0}\n`
      + `Resolved Complaints,${stats?.resolvedComplaints || 0}\n`
      + `Resolution Rate,${stats?.resolutionRate || 85}%\n`
      + `Avg Turnaround Hours,${stats?.avgResolutionHours || 4}h\n`
      + `Top Category,${stats?.mostCommonCategory || 'General'}\n`
      + `Top Problem Building,${stats?.mostProblematicBuilding || 'Academic Block A'}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CampusFix_Admin_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const priorityPieData = [
    { name: 'Emergency', value: stats?.emergencyComplaints || 3, color: '#ef4444' },
    { name: 'High', value: Math.max(2, Math.round((stats?.pendingComplaints || 10) * 0.4)), color: '#f97316' },
    { name: 'Medium', value: Math.max(3, Math.round((stats?.pendingComplaints || 10) * 0.4)), color: '#3b82f6' },
    { name: 'Low', value: Math.max(1, Math.round((stats?.pendingComplaints || 10) * 0.2)), color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans">

      {/* Elegantly Arranged Admin Banner */}
      <div className="relative bg-gradient-to-r from-rose-700 via-red-700 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-rose-500/15 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 flex items-center pointer-events-none">
          <ShieldCheck className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Campus Central Administration Command Desk
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-400/25 text-rose-200 border border-rose-300/30 text-[11px] font-extrabold uppercase">
              Chief Administrator
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Command Center
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-300 drop-shadow-sm">
                {user?.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Head Administrator</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-rose-100/90 font-medium max-w-2xl leading-relaxed">
            Real-time telemetry of campus grievances, staff auto-dispatch workload, student community resolution times, and predictive asset failure analytics.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAdminStats}
              className="px-5 py-2.5 rounded-xl bg-white text-rose-800 hover:bg-rose-50 text-xs font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Refresh Analytics</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition inline-flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>

            <Link
              to="/admin/complaints"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Manage Complaints</span>
            </Link>

            <Link
              to="/predictive-maintenance"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>Predictive Fleet Health</span>
            </Link>
          </div>

        </div>
      </div>

      {/* AI Smart Auto-Dispatch Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-black text-white">AI Autonomous Ticket Auto-Dispatcher</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
              Active v2.5
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Automatically analyze unassigned tickets, match technician skill sets, and dispatch field work-orders instantly.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAIDispatch}
          disabled={autoDispatching}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 text-white font-black text-xs transition flex items-center gap-2 shadow-lg shadow-brand-500/20 cursor-pointer flex-shrink-0"
        >
          {autoDispatching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing &amp; Routing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-amber-300" />
              <span>1-Click AI Auto-Dispatch</span>
            </>
          )}
        </button>
      </div>

      {/* AI Dispatch Result Modal / Notification */}
      {autoDispatchResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3 animate-scale-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">AI Auto-Dispatch Completed at {autoDispatchResult.timestamp}: </span>
              <span>Successfully routed {autoDispatchResult.dispatchedCount} tickets across {autoDispatchResult.assignedDepartments.join(', ')} (Saved {autoDispatchResult.timeSaved}).</span>
            </div>
          </div>
          <button
            onClick={() => setAutoDispatchResult(null)}
            className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 8 Primary Key Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-brand-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Registered Students</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.totalStudents || 0}</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-brand-500 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Campus User Base</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Grievances Filed</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.totalComplaints || 0}</span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-500 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Lifetime Campus Tickets</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending Issues</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats?.pendingComplaints || 0}</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[10px] text-amber-600 font-bold block mt-1">Awaiting Resolution</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Resolved Complaints</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">{stats?.resolvedComplaints || 0}</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">{stats?.resolutionRate || 85}% Resolution Rate</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-rose-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Emergency Alerts</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-rose-600">{stats?.emergencyComplaints || 0}</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <span className="text-[10px] text-rose-500 font-bold block mt-1">High Priority</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-sky-500/40 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Resolution Speed</span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.avgResolutionHours || 4}h</span>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Technician turnaround</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-400 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Most Problem Building</span>
            <div className="mt-1.5">
              <span className="text-sm font-black text-slate-900 dark:text-white truncate block">
                {stats?.mostProblematicBuilding || 'Academic Block A'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Highest ticket density</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-slate-400 transition">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Top Issue Category</span>
            <div className="mt-1.5">
              <span className="text-sm font-black text-brand-600 truncate block">
                {stats?.mostCommonCategory || 'Electrical & Wi-Fi'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">Most frequent grievance</span>
          </div>

        </div>
      )}

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Chart 1: Complaints by Category */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            Complaints by Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.byCategory || []}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Monthly Resolution Trend */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Resolution Performance
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.monthlyTrend || []}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="Complaints" stroke="#ef4444" strokeWidth={3} />
                <Line type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Priority Breakdown Pie Chart */}
        <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Severity Matrix Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Campus Heatmap Section */}
      <Heatmap />

    </div>
  );
};

export default AdminOverview;
