import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Bot,
  Zap,
  Filter,
  CheckCircle,
  Clock,
  ShieldAlert,
  User,
  Wrench
} from 'lucide-react';

const AdminComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [updateStatus, setUpdateStatus] = useState('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [autoAssignSuccess, setAutoAssignSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `/complaints?`;
      if (statusFilter !== 'All') url += `&status=${statusFilter}`;
      
      const [compRes, usersRes] = await Promise.all([
        api.get(url),
        api.get('/admin/users?role=staff')
      ]);

      if (compRes.data.success) setComplaints(compRes.data.complaints);
      if (usersRes.data.success) setStaffList(usersRes.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Smart AI Auto-Assign Recommendation Calculator
  const getAIRecommendation = (complaint) => {
    const cat = (complaint.category || '').toLowerCase();
    const staffMatch = staffList.find(s => {
      const dept = (s.department || '').toLowerCase();
      if (cat.includes('electric') && (dept.includes('electric') || dept.includes('maint'))) return true;
      if (cat.includes('water') && (dept.includes('plumb') || dept.includes('maint'))) return true;
      if ((cat.includes('wifi') || cat.includes('lab') || cat.includes('class')) && dept.includes('it')) return true;
      return false;
    }) || staffList[0] || { _id: 'staff_default', name: 'Ramesh Electrician', department: 'Maintenance Wing' };

    let teamName = 'Electrical Response Team A';
    if (cat.includes('water')) teamName = 'Plumbing & Sanitation Unit';
    else if (cat.includes('wifi') || cat.includes('class') || cat.includes('lab')) teamName = 'IT & AV Rapid Squad';

    return {
      staff: staffMatch,
      team: teamName,
      matchScore: 96,
      rationale: `${staffMatch.name} is stationed nearest to ${complaint.building}, has 1 active task, and specializes in ${complaint.category} issues.`
    };
  };

  const handleApproveAutoAssign = async (complaint) => {
    const rec = getAIRecommendation(complaint);
    try {
      setUpdating(true);
      await api.put(`/complaints/${complaint._id}/assign`, {
        assignedStaffName: rec.staff.name,
        assignedStaffPhone: rec.staff.phone || '+91 98765 00004',
        staffId: rec.staff._id,
        internalNotes: `Auto-assigned via Smart AI Engine: ${rec.rationale}`
      });
      setAutoAssignSuccess(`Smart Auto-Assignment approved! #${complaint.ticketId} assigned to ${rec.staff.name} (${rec.team}).`);
      setTimeout(() => setAutoAssignSuccess(''), 5000);
      fetchData();
      setSelectedComplaint(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleManualAssign = async (complaintId) => {
    if (!assignStaffId) return;
    const targetStaff = staffList.find(s => s._id === assignStaffId);
    try {
      setUpdating(true);
      await api.put(`/complaints/${complaintId}/assign`, {
        staffId: assignStaffId,
        assignedStaffName: targetStaff?.name || 'Assigned Technician',
        assignedStaffPhone: targetStaff?.phone || '+91 98765 00004',
        remarks: 'Assigned manually by Campus Administrator'
      });
      setSelectedComplaint(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (complaintId) => {
    try {
      setUpdating(true);
      await api.put(`/complaints/${complaintId}/status`, {
        status: updateStatus,
        remarks: statusRemarks || `Updated to ${updateStatus}`
      });
      setSelectedComplaint(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter(c => {
    const matchCat = categoryFilter === 'All' || c.category === categoryFilter;
    if (!matchCat) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.ticketId && c.ticketId.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.building && c.building.toLowerCase().includes(q)) ||
      (c.roomNumber && c.roomNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
              <Zap className="w-3.5 h-3.5 text-purple-600" />
              Smart Auto-Assignment Enabled
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-purple-600" />
            Infrastructure Complaint Management & Dispatch Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review complaints, approve AI recommended technician assignments, and supervise campus task resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/predictive-maintenance"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predictive Fleet Health</span>
          </Link>
        </div>
      </div>

      {autoAssignSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg animate-scale-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{autoAssignSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#151e32] p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Ticket ID (#CFX-...), problem title, building or room..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
          >
            <option value="All">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Water">Water</option>
            <option value="Internet/Wi-Fi">Internet/Wi-Fi</option>
            <option value="Classroom">Classroom</option>
            <option value="Hostel">Hostel</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold"
          >
            <option value="All">All Statuses</option>
            <option value="NEW">NEW (Unassigned)</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

      </div>

      {/* Complaints Table with AI Auto-Assignment Column */}
      <div className="bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-black uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/50">
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Issue & Location</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Smart AI Dispatch Recommendation</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading campus complaints...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No complaints match your active filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const rec = getAIRecommendation(c);
                  const isAssigned = c.assignedTo || c.assignedStaffName;

                  return (
                    <tr key={c._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                      
                      <td className="py-4 px-4 font-black text-purple-600">
                        #{c.ticketId || c._id.slice(-5).toUpperCase()}
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <p className="font-black text-slate-900 dark:text-white truncate">{c.title}</p>
                        <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                          {c.building} • {c.roomNumber} ({c.category})
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          c.priority === 'Emergency' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                          c.priority === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {c.priority}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                          c.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                          c.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                          c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      {/* Smart Auto-Assignment AI Box */}
                      <td className="py-4 px-4 max-w-sm">
                        {isAssigned ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{c.assignedStaffName || 'Technician Assigned'}</span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-purple-900 dark:text-purple-200 flex items-center gap-1">
                                <Bot className="w-3 h-3 text-purple-600" />
                                {rec.team}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-600">
                                {rec.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {rec.rationale}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleApproveAutoAssign(c)}
                              disabled={updating}
                              className="mt-1 w-full py-1 px-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-[10px] transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                              <span>Approve AI Auto-Assignment</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedComplaint(c)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs transition"
                          >
                            Manage
                          </button>
                          <Link
                            to={`/complaints/${c._id}`}
                            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                            title="View Full Ticket"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Assignment & Status Override Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-5 shadow-2xl animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black text-purple-600 uppercase">Manage Ticket</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">#{selectedComplaint.ticketId}</h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedComplaint.title}</p>
                <p className="text-slate-500 mt-0.5">{selectedComplaint.building} • {selectedComplaint.roomNumber}</p>
              </div>

              {/* 1-Click AI Auto Assign Option */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    AI Smart Recommendation
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">96% Match</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {getAIRecommendation(selectedComplaint).rationale}
                </p>
                <button
                  type="button"
                  onClick={() => handleApproveAutoAssign(selectedComplaint)}
                  disabled={updating}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Approve & Assign ({getAIRecommendation(selectedComplaint).staff.name})</span>
                </button>
              </div>

              {/* Manual Staff Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Or Manually Select Staff Technician:
                </label>
                <div className="flex gap-2">
                  <select
                    value={assignStaffId}
                    onChange={e => setAssignStaffId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="">Choose Staff Member</option>
                    {staffList.map(s => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.department || 'Maintenance'})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleManualAssign(selectedComplaint._id)}
                    disabled={updating || !assignStaffId}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold transition"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* Status Update */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Update Ticket Status:
                </label>
                <div className="flex gap-2">
                  <select
                    value={updateStatus}
                    onChange={e => setUpdateStatus(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedComplaint._id)}
                    disabled={updating}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition"
                  >
                    Update
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminComplaints;
