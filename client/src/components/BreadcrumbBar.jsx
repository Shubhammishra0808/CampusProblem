import React, { useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const routeTitles = {
  '/student': 'Student Dashboard',
  '/admin': 'Admin Command Center',
  '/admin/complaints': 'Complaints Management',
  '/admin/users': 'User Management',
  '/faculty': 'Faculty & Academic Portal',
  '/hod': 'HOD Department Desk',
  '/staff': 'Staff Operations Desk',
  '/team-dashboard': 'Team Member Command Hub',
  '/attendance': 'Smart Attendance Hub',
  '/attendance/my': 'My Attendance',
  '/attendance/mark': 'Mark Attendance',
  '/attendance/history': 'Attendance History',
  '/attendance/calendar': 'Attendance Calendar',
  '/attendance/analytics': 'Attendance Analytics',
  '/attendance/reports': 'Attendance Reports',
  '/attendance/settings': 'Attendance Settings',
  '/chat': 'Live Campus Chat',
  '/qr-report': '1-Tap QR Report',
  '/predictive-maintenance': 'Predictive Fleet Health',
  '/maintenance': 'Equipment Maintenance',
  '/complaint/new': 'New Grievance Report',
  '/complaints/new': 'New Grievance Report',
  '/complaints': 'My Complaints',
  '/complaints/my': 'My Complaints',
  '/notices': 'Campus Notice Board',
  '/resources': 'Study Resources Hub',
  '/placements': 'Placement & Career Hub',
  '/lost-found': 'Lost & Found Vault',
  '/feedback': 'Campus Feedback & Suggestions',
  '/emergency': 'Emergency & Safety Center',
  '/faculty-directory': 'Faculty Directory',
  '/study-room': 'Smart Study Room & Pods',
  '/smart-study-room': 'Smart Study Room & Pods',
  '/profile': 'My Profile & Digital ID'
};

const BreadcrumbBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const currentPath = location.pathname;

  const getHomeRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teammember') return '/team-dashboard';
    if (user.role === 'hod' || user.role === 'faculty') return '/faculty';
    if (user.role === 'staff') return '/staff';
    return '/student';
  };

  const homeRoute = getHomeRoute();
  const isAtHome = currentPath === homeRoute || currentPath === '/';

  // Extract path parts for breadcrumbs
  const pathSegments = currentPath.split('/').filter(Boolean);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(homeRoute);
    }
  };

  // If already at main dashboard, show light welcome beacon
  if (isAtHome) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
          <span className="text-slate-900 dark:text-white font-bold">
            {routeTitles[currentPath] || 'Campus Command Portal'}
          </span>
          <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">• Active Session</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-lg bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-500/30">
            {user?.role?.toUpperCase() || 'USER'}
          </span>
        </div>
      </div>
    );
  }

  // Inside a subpage or inner section: Show prominent Back Button & Interactive Breadcrumb trail
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md text-xs font-semibold transition-colors duration-200 animate-fade-in">
      
      {/* Left Side: Back Action & Dynamic Title */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleBack}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-white border border-slate-200 dark:border-slate-700 font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95 group"
          title="Go back to previous page"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600 dark:text-brand-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

        {/* Breadcrumb Path Links */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Link
            to={homeRoute}
            className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition"
            title="Go to Home Dashboard"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          {pathSegments.map((segment, idx) => {
            const pathUrl = `/${pathSegments.slice(0, idx + 1).join('/')}`;
            const isLast = idx === pathSegments.length - 1;
            const segmentTitle = routeTitles[pathUrl] || segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

            return (
              <React.Fragment key={pathUrl}>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                {isLast ? (
                  <span className="font-black text-slate-900 dark:text-white truncate max-w-[200px]">
                    {segmentTitle}
                  </span>
                ) : (
                  <Link
                    to={pathUrl}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition truncate max-w-[150px]"
                  >
                    {segmentTitle}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Side: Quick Shortcut to Home Dashboard */}
      <div className="flex items-center gap-2">
        <Link
          to={homeRoute}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          title="Return directly to main Dashboard"
        >
          <Home className="w-3.5 h-3.5 text-brand-500" />
          <span>Dashboard</span>
        </Link>
      </div>

    </div>
  );
};

export default BreadcrumbBar;
