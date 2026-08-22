import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Timeline from '../components/Timeline';
import {
  MapPin,
  Calendar,
  UserCheck,
  ShieldAlert,
  Star,
  CheckCircle,
  RotateCcw,
  ArrowLeft,
  Image as ImageIcon,
  Printer,
  ThumbsUp,
  Copy,
  Check,
  Clock,
  Sparkles,
  Lock,
  ShieldCheck,
  Building,
  User,
  Wrench
} from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const res = await api.get(`/complaints/${id}`);
      if (res.data.success) {
        setComplaint(res.data.complaint);
        setTimeline(res.data.timeline);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Grievance ticket not found or access restricted.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResolution = async (action) => {
    try {
      setVerifying(true);
      const res = await api.post(`/complaints/${id}/verify-feedback`, {
        action, // 'VERIFIED' or 'REOPEN'
        rating,
        feedback: feedbackText
      });
      if (res.data.success) {
        setMessage(res.data.message);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const handleUpvote = async () => {
    try {
      setUpvoting(true);
      const res = await api.post(`/complaints/${id}/upvote`);
      if (res.data.success) {
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpvoting(false);
    }
  };

  const handleCopyTicketId = () => {
    if (!complaint?.ticketId) return;
    navigator.clipboard.writeText(complaint.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-semibold">Loading confidential grievance ticket...</p>
      </div>
    );
  }

  if (errorMessage || !complaint) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#151e32] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-black text-slate-900 dark:text-white">Confidential Access Notice</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {errorMessage || 'This complaint ticket is private and can only be accessed by the submitting student or authorized Campus Administration.'}
        </p>
        <Link to="/complaints/my" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow hover:bg-brand-700 transition">
          Return to My Grievance Vault
        </Link>
      </div>
    );
  }

  const isOwner = user && complaint.submittedBy && (complaint.submittedBy._id === user._id || complaint.submittedBy === user._id);
  const hasUpvoted = user && complaint.upvotes && complaint.upvotes.includes(user._id);
  const upvoteCount = complaint.upvotes ? complaint.upvotes.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/complaints/my"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-brand-500 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Back to My Grievance Vault</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Print / Save Receipt Button */}
          <button
            type="button"
            onClick={handlePrintReceipt}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm cursor-pointer"
            title="Print Official Ticket Dispatch Card"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          {/* Upvote / Me-Too Button */}
          <button
            type="button"
            onClick={handleUpvote}
            disabled={upvoting}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-extrabold transition shadow-sm cursor-pointer ${
              hasUpvoted
                ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/20'
                : 'bg-white dark:bg-[#151e32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-brand-400'
            }`}
            title="Support this issue if you are experiencing it too"
          >
            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current text-brand-600' : 'text-slate-400'}`} />
            <span>Me Too ({upvoteCount})</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Ticket Summary Box */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-extrabold border border-brand-200 dark:border-brand-800">
                <span>#{complaint.ticketId}</span>
                <button
                  type="button"
                  onClick={handleCopyTicketId}
                  className="text-slate-400 hover:text-brand-600 transition cursor-pointer"
                  title="Copy Ticket ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {complaint.category}
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <Lock className="w-3 h-3 text-emerald-600" /> Private & Confidential
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
              {complaint.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
              complaint.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
              complaint.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
              complaint.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' :
              'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
            }`}>
              Status: {complaint.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
            <span className="font-black text-slate-900 dark:text-slate-100">
              {complaint.building} • {complaint.roomNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Priority Level</span>
            <span className="font-black text-slate-900 dark:text-slate-100">
              {complaint.priority}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Technician</span>
            <span className="font-black text-slate-900 dark:text-slate-100">
              {complaint.assignedTo ? `${complaint.assignedTo.name} (${complaint.assignedTo.phone || 'Staff'})` : 'Awaiting Technician Dispatch'}
            </span>
          </div>
        </div>

        {/* Description & Photo */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Description</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {complaint.description}
          </p>

          {complaint.photoUrl && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">Attached Problem Evidence Photo</span>
              <img
                src={complaint.photoUrl}
                alt="Complaint attachment"
                className="max-h-64 rounded-2xl border border-slate-200 dark:border-slate-700 object-cover shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Verification Rating Box for Student when status is RESOLVED */}
        {complaint.status === 'RESOLVED' && isOwner && (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Issue Marked Resolved by Technician. Please Verify!
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                Please inspect the room/equipment and rate your resolution satisfaction.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rating:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition cursor-pointer ${rating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder="Optional remarks (e.g. Fan working perfectly now, thank you!)"
              className="w-full p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVerifyResolution('VERIFIED')}
                disabled={verifying}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Confirm Satisfactory Resolution & Close
              </button>

              <button
                onClick={() => handleVerifyResolution('REOPEN')}
                disabled={verifying}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition cursor-pointer"
              >
                Reopen Ticket (Issue persisting)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Progress Timeline Component */}
      <div className="bg-white dark:bg-[#151e32] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Ticket Resolution Timeline</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step log of actions taken by maintenance staff</p>
        </div>
        <Timeline currentStatus={complaint.status} history={timeline} />
      </div>

    </div>
  );
};

export default ComplaintDetails;
