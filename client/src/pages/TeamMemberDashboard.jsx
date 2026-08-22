import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  Zap,
  ShieldAlert,
  ClipboardList,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MessageSquare,
  MapPin,
  Bell,
  Search,
  Filter,
  Layers,
  Crown,
  Building
} from 'lucide-react';
import Heatmap from '../components/Heatmap';

const TeamMemberDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalComplaints: 24,
    pendingComplaints: 4,
    emergencyComplaints: 1,
    resolvedComplaints: 18
  });
  const [complaints, setComplaints] = useState([
    { _id: 'comp_001', ticketId: 'CF-2026-0001-302', title: 'Ceiling Fan malfunction in Room C-204', category: 'Electrical', priority: 'High', status: 'In Progress', building: 'Academic Block C', roomNumber: 'C-204' },
    { _id: 'comp_002', ticketId: 'CF-2026-0002-108', title: 'High-speed Wi-Fi Access Point unreachable in Block A Lab 3', category: 'Internet/Wi-Fi', priority: 'Emergency', status: 'Pending', building: 'Academic Block A', roomNumber: 'Lab 3' }
  ]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [statsRes, compRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/complaints')
      ]);

      if (statsRes?.data?.success && statsRes.data.stats) setStats(statsRes.data.stats);
      if (compRes?.data?.success && compRes.data.complaints?.length > 0) setComplaints(compRes.data.complaints);
    } catch (err) {
      console.warn('Team data fallback to cache:', err);
    }
  };

  const handleAssignStaff = async (complaintId, staffName) => {
    try {
      await api.put(`/complaints/${complaintId}/assign`, {
        assignedStaffName: staffName || 'Maintenance Core Team',
        assignedStaffPhone: '+91 98765 43210',
        internalNotes: 'Assigned via Team Member Command Desk'
      });
      fetchTeamData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: newStatus,
        remarks: `Status updated to ${newStatus} by Team Member ${user?.name}`
      });
      fetchTeamData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchCategory && matchStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HUGE BOLD TEAM MEMBER AUTHORITY BANNER */}
      <div className="relative bg-gradient-to-r from-purple-800 via-indigo-800 to-brand-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-purple-500/20 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 flex items-center pointer-events-none">
          <Zap className="w-80 h-80 fill-amber-400 text-amber-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 backdrop-blur-md text-xs font-black text-amber-300 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-amber-300" />
              Core Operations Committee Authority
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-300/30 text-[11px] font-extrabold">
              Superior Dispatch Rights
            </span>
          </div>

          {/* BIG BOLD NAME */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Team Lead Command — <span className="text-amber-300 drop-shadow-md underline decoration-amber-400 decoration-4">{user?.name}</span> ⚡
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-purple-100 text-xs sm:text-sm mt-3 font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              {user?.department || 'Core Operations Committee'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Role: <span className="font-extrabold text-white">Core Committee Lead</span>
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-purple-700" />
              <span>Open Online Chat Desk</span>
            </Link>

            <Link
              to="/admin/complaints"
              className="px-5 py-3 rounded-2xl bg-purple-900/50 hover:bg-purple-900/70 text-white border border-purple-300/40 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2"
            >
              <ClipboardList className="w-4 h-4 text-purple-200" />
              <span>All Campus Grievances ({complaints.length})</span>
            </Link>

            <Link
              to="/notices"
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-white" />
              <span>Broadcast Notice</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.totalComplaints || complaints.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Total Grievances</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.pendingComplaints || 0}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Pending Actions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.emergencyComplaints || 0}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Emergency Alerts</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{stats?.resolvedComplaints || 0}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Resolved Tickets</span>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <Heatmap />

      {/* Task & Staff Dispatch Board */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Direct Task & Staff Dispatch Board
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Supervise all campus tickets with 1-click status & technician dispatch</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Water">Water</option>
              <option value="Internet/Wi-Fi">Internet/Wi-Fi</option>
              <option value="Classroom">Classroom</option>
              <option value="Hostel">Hostel</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-black uppercase tracking-wider">
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Title & Location</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3 text-right">Team Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.slice(0, 10).map(c => (
                <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3 font-black text-purple-600">
                    #{c.ticketId || c._id.slice(-5).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                    <span className="text-[11px] text-slate-400">{c.building} • {c.roomNumber || 'Campus'}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      c.priority === 'Emergency' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                      c.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <select
                      value={c.status}
                      onChange={e => handleStatusChange(c._id, e.target.value)}
                      className="px-2 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="NEW">NEW</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {c.assignedStaffName || 'Unassigned'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAssignStaff(c._id, 'Electrician - R. Verma')}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-[11px] font-black transition cursor-pointer"
                      >
                        Quick Assign
                      </button>
                      <Link
                        to={`/complaints/${c._id}`}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default TeamMemberDashboard;
