import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

const ComplaintCard = ({ complaint }) => {
  const statusColors = {
    NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    ASSIGNED: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    RESOLVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    VERIFIED: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    CLOSED: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
  };

  const priorityBadge = {
    Emergency: 'bg-rose-500 text-white font-extrabold animate-pulse',
    High: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-bold',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-medium',
    Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  };

  return (
    <div className="hover-card bg-white dark:bg-[#151e32] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 group flex flex-col justify-between">
      <div>
        
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 tracking-wider">#{complaint.ticketId}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusColors[complaint.status]}`}>
              {complaint.status}
            </span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${priorityBadge[complaint.priority]}`}>
            {complaint.priority}
          </span>
        </div>

        {/* Title & Category */}
        <div className="mb-3">
          <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            {complaint.category}
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition line-clamp-1">
            {complaint.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {complaint.description}
          </p>
        </div>

        {/* Location Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 py-2 border-t border-b border-slate-100 dark:border-slate-700/60 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            {complaint.building} ({complaint.roomNumber})
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          By: {complaint.isAnonymous ? 'Anonymous Student' : complaint.submittedBy?.name || 'Student'}
        </span>

        <Link
          to={`/complaints/${complaint._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
        >
          <span>Track Ticket</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  );
};

export default ComplaintCard;
