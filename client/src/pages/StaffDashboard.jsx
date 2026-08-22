import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Phone,
  ArrowRight,
  Filter,
  Sparkles,
  Zap,
  Building,
  CheckCircle
} from 'lucide-react';
import api from '../services/api';
import Heatmap from '../components/Heatmap';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchStaffTasks();
  }, []);

  const fetchStaffTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: newStatus,
        remarks: `Updated to ${newStatus} by Technician ${user?.name}`
      });
      fetchStaffTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = complaints.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const pendingCount = complaints.filter(c => ['NEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(c.status)).length;
  const emergencyCount = complaints.filter(c => c.priority === 'Emergency').length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HUGE BOLD TECHNICIAN BANNER */}
      <div className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl shadow-purple-500/15 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 flex items-center pointer-events-none">
          <Wrench className="w-80 h-80" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Maintenance & Field Operations Desk
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-400/25 text-purple-200 border border-purple-300/30 text-[11px] font-extrabold uppercase">
              Field Technician
            </span>
          </div>

          {/* BIG BOLD NAME */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Welcome, <span className="text-amber-300 drop-shadow-md underline decoration-amber-400 decoration-4">{user?.name}</span>! 🛠️
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-purple-100 text-xs sm:text-sm mt-3 font-semibold">
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-300" />
              {user?.department || 'Maintenance & Facilities'}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Employee ID: <span className="font-extrabold text-white">{user?.employeeId || 'MNT-304'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              Role: <span className="font-extrabold text-white">{user?.designation || 'Senior Electrical & Facilities Tech'}</span>
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="px-5 py-3 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 text-xs sm:text-sm font-black shadow-lg shadow-black/10 transition inline-flex items-center gap-2"
            >
              <span>Live Campus Dispatch Chat</span>
            </Link>
            <Link
              to="/emergency"
              className="px-5 py-3 rounded-2xl bg-rose-500/30 hover:bg-rose-500/40 text-white border border-rose-300/40 text-xs sm:text-sm font-black backdrop-blur-md transition inline-flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-300" />
              <span>Emergency Helpdesk</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{complaints.length}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Total Work Orders</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{pendingCount}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Pending Repair</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{resolvedCount}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">Completed & Verified</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{emergencyCount}</span>
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">High Emergency</span>
          </div>
        </div>
      </div>

      {/* Campus Map */}
      <Heatmap />

      {/* Technician Task List with Direct Status Controls */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" />
              Technician Field Repair Task Queue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Update ticket state and resolve campus hardware/infrastructure problems</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="ASSIGNED">ASSIGNED</option>
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
                <th className="py-3 px-3">Location & Issue</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(c => (
                <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3 font-black text-purple-600">
                    #{c.ticketId || c._id.slice(-5).toUpperCase()}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                    <span className="text-[11px] text-slate-400">{c.building} • {c.roomNumber || 'Campus Wing'}</span>
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
                      onChange={e => handleUpdateStatus(c._id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="NEW">NEW</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED (Fixed)</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      to={`/complaints/${c._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-[11px] font-extrabold transition"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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

export default StaffDashboard;
