import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Quick Ticket Tracker State
  const [trackerInput, setTrackerInput] = useState('');
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackerError, setTrackerError] = useState('');

  const categories = [
    'All',
    'Electrical',
    'Water',
    'Internet/Wi-Fi',
    'Classroom',
    'Laboratory',
    'Hostel',
    'Canteen',
    'Cleanliness',
    'Security'
  ];

  useEffect(() => {
    fetchMyComplaints();
  }, [activeTab, selectedCategory]);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      let url = `/complaints?my=true`;
      if (activeTab !== 'All') url += `&status=${activeTab}`;
      if (selectedCategory !== 'All') url += `&category=${encodeURIComponent(selectedCategory)}`;

      const res = await api.get(url);
      if (res.data.success) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTrack = async (e) => {
    e.preventDefault();
    if (!trackerInput.trim()) return;

    setTrackerLoading(true);
    setTrackerError('');
    setTrackedTicket(null);

    try {
      const res = await api.get(`/complaints/track/${trackerInput.trim()}`);
      if (res.data.success) {
        setTrackedTicket(res.data);
      }
    } catch (err) {
      setTrackerError(err.response?.data?.message || `No ticket found for #${trackerInput.trim().toUpperCase()}`);
    } finally {
      setTrackerLoading(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.ticketId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.building.toLowerCase().includes(q) ||
      c.roomNumber.toLowerCase().includes(q)
    );
  });

  const pendingCount = complaints.filter(c => ['NEW', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const resolvedCount = complaints.filter(c => ['RESOLVED', 'VERIFIED', 'CLOSED'].includes(c.status)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
              <Lock className="w-3 h-3 text-emerald-600" />
              Private Grievance Vault (Encrypted)
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">My Grievances & Live Ticket Tracker</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track real-time maintenance progress, technician assignments, and verification status of all your reported issues.
          </p>
        </div>

        <Link
          to="/complaints/new"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-brand-500/20 transition inline-flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Stats Summary + Quick Tracker Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Quick Ticket ID Lookup Box */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-md border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-300 text-[10px] font-bold">
              <Sparkles className="w-3 h-3" />
              Instant Search
            </span>
            <h3 className="text-sm font-black mt-1 text-white">Track Any Ticket by Ticket ID</h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Enter your ticket number (e.g. CFX-1002) to view live technician status immediately.
            </p>
          </div>

          <form onSubmit={handleQuickTrack} className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">#</span>
              <input
                type="text"
                required
                value={trackerInput}
                onChange={e => setTrackerInput(e.target.value)}
                placeholder="Enter Ticket ID (e.g. CFX-1002)"
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <button
              type="submit"
              disabled={trackerLoading}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              {trackerLoading ? 'Tracking...' : 'Track Ticket'}
            </button>
          </form>

          {trackerError && (
            <p className="text-[11px] text-rose-300 mt-2 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {trackerError}
            </p>
          )}
        </div>

        {/* Mini Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-500">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">{pendingCount}</span>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">Active In-Progress</span>
          </div>

          <div className="bg-white dark:bg-[#151e32] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">{resolvedCount}</span>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-2">Resolved Fixed</span>
          </div>
        </div>

      </div>

      {/* Tabs, Category Pills & Search */}
      <div className="bg-white dark:bg-[#151e32] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
            {['All', 'NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab === 'IN_PROGRESS' ? 'In Progress' : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket or room..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider mr-1">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Grievances Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              You haven't submitted any grievances matching this status or filter.
            </p>
          </div>
          <Link
            to="/complaints/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit a New Grievance</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <ComplaintCard key={c._id} complaint={c} />
          ))}
        </div>
      )}

      {/* ================= QUICK TRACK RESULT MODAL ================= */}
      {trackedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#151e32] rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-in">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-600 dark:text-brand-400">#{trackedTicket.complaint.ticketId}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 uppercase">
                  {trackedTicket.complaint.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setTrackedTicket(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{trackedTicket.complaint.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{trackedTicket.complaint.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                <span className="font-black text-slate-800 dark:text-slate-200">
                  {trackedTicket.complaint.building} • {trackedTicket.complaint.roomNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Staff</span>
                <span className="font-black text-slate-800 dark:text-slate-200">
                  {trackedTicket.complaint.assignedTo ? trackedTicket.complaint.assignedTo.name : 'Pending Assignment'}
                </span>
              </div>
            </div>

            {/* Quick Timeline items */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Recent Status Log</span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {trackedTicket.timeline?.map((t, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[11px] flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.remarks || t.status}</span>
                    <span className="text-slate-400 text-[10px] flex-shrink-0">{new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={`/complaints/${trackedTicket.complaint._id}`}
                onClick={() => setTrackedTicket(null)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Open Full Grievance View & Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyComplaints;
