import React from 'react';
import { CheckCircle2, Clock, AlertCircle, UserCheck, ShieldCheck, Lock } from 'lucide-react';

const Timeline = ({ currentStatus, history = [] }) => {
  const steps = [
    { key: 'NEW', label: 'Ticket Submitted', icon: Clock, desc: 'Complaint registered in platform' },
    { key: 'ASSIGNED', label: 'Staff Assigned', icon: UserCheck, desc: 'Maintenance staff assigned to task' },
    { key: 'IN_PROGRESS', label: 'In Progress', icon: AlertCircle, desc: 'Technician working on issue' },
    { key: 'RESOLVED', label: 'Issue Resolved', icon: CheckCircle2, desc: 'Work completed by maintenance team' },
    { key: 'VERIFIED', label: 'Student Verified', icon: ShieldCheck, desc: 'Confirmed & rated by student' },
    { key: 'CLOSED', label: 'Ticket Closed', icon: Lock, desc: 'Archived in system' }
  ];

  const getStatusIndex = (st) => {
    return steps.findIndex(s => s.key === st);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        Resolution Workflow & Tracking Progress
      </h3>

      {/* Horizontal Progress Bar for Large Screens */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-5 h-1 bg-slate-200 dark:bg-slate-700 z-0">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 100)}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 w-24 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/60 shadow-lg scale-110'
                    : isDone
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold mt-2 ${isDone ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed History Timeline List */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Activity Log</h4>
        
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 pl-6 space-y-6">
          {history.length === 0 ? (
            <p className="text-xs text-slate-400">No activity history recorded yet.</p>
          ) : (
            history.map((h, i) => (
              <div key={h._id || i} className="relative">
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900"></div>
                <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Status: {h.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(h.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {h.updatedBy && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Updated by: <span className="font-semibold">{h.updatedBy.name}</span> ({h.updatedBy.role})
                    </p>
                  )}

                  {h.remarks && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      "{h.remarks}"
                    </p>
                  )}

                  {h.attachmentUrl && (
                    <a
                      href={h.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-semibold text-brand-600 hover:underline"
                    >
                      📎 View Resolution Proof Photo
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
