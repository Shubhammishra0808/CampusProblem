import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  FileText,
  PlusCircle,
  BookOpen,
  Bell,
  Briefcase,
  Search,
  AlertTriangle,
  Users,
  MessageSquare,
  User,
  LayoutDashboard,
  ClipboardList,
  Bot,
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  QrCode,
  Activity,
  PanelLeftClose,
  CalendarCheck2,
  Cpu,
  Headphones
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onOpenSOS, onOpenAI }) => {
  const { user } = useContext(AuthContext);
  const { t } = useLanguage();

  const getNavSections = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          {
            section: 'Command & Analytics',
            links: [
              { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
              { name: 'Smart Attendance Grid', path: '/attendance', icon: CalendarCheck2 },
              { name: 'Predictive Fleet Health', path: '/predictive-maintenance', icon: Activity },
              { name: 'Manage Complaints', path: '/admin/complaints', icon: ClipboardList },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'User Management', path: '/admin/users', icon: Users },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Academic & Campus Hub',
            links: [
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Study Resources & Notes', path: '/resources', icon: BookOpen },
              { name: 'Placements & Drives', path: '/placements', icon: Briefcase },
              { name: 'Lost & Found Hub', path: '/lost-found', icon: Search },
              { name: 'Faculty Directory', path: '/faculty-directory', icon: Users }
            ]
          },
          {
            section: 'Account & Safety',
            links: [
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle, highlight: true },
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];

      case 'teammember':
        return [
          {
            section: 'Core Team Command',
            links: [
              { name: 'Team Member Command Hub', path: '/team-dashboard', icon: LayoutDashboard },
              { name: 'Predictive Fleet Health', path: '/predictive-maintenance', icon: Activity },
              { name: 'Manage Complaints', path: '/admin/complaints', icon: ClipboardList },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Campus Resources',
            links: [
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Study Resources & Notes', path: '/resources', icon: BookOpen },
              { name: 'Placements & Drives', path: '/placements', icon: Briefcase },
              { name: 'Faculty Directory', path: '/faculty-directory', icon: Users }
            ]
          },
          {
            section: 'Account & Safety',
            links: [
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle, highlight: true },
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];

      case 'hod':
        return [
          {
            section: 'Department Portal',
            links: [
              { name: 'Faculty Directory', path: '/faculty', icon: LayoutDashboard },
              { name: 'Smart Attendance Grid', path: '/attendance', icon: CalendarCheck2 },
              { name: 'Predictive Fleet Health', path: '/predictive-maintenance', icon: Activity },
              { name: 'Manage Complaints', path: '/admin/complaints', icon: ClipboardList },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Academic Supervision',
            links: [
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Study Resources & Notes', path: '/resources', icon: BookOpen },
              { name: 'Placements & Drives', path: '/placements', icon: Briefcase },
              { name: 'Faculty Directory', path: '/faculty-directory', icon: Users }
            ]
          },
          {
            section: 'Account & Safety',
            links: [
              { name: 'Campus Feedback & Suggestions', path: '/feedback', icon: MessageSquare },
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle },
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];

      case 'faculty':
        return [
          {
            section: 'Faculty Workstation',
            links: [
              { name: 'Faculty Directory', path: '/faculty', icon: LayoutDashboard },
              { name: 'Mark Class Attendance', path: '/attendance', icon: CalendarCheck2 },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'Report Issue', path: '/complaints/new', icon: PlusCircle },
              { name: 'My Complaints', path: '/complaints/my', icon: FileText },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Teaching & Students',
            links: [
              { name: 'Study Resources & Notes', path: '/resources', icon: BookOpen },
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Lost & Found Hub', path: '/lost-found', icon: Search }
            ]
          },
          {
            section: 'Account & Safety',
            links: [
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle },
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];

      case 'staff':
        return [
          {
            section: 'Operations & Tasks',
            links: [
              { name: 'Staff Operations Desk', path: '/staff', icon: LayoutDashboard },
              { name: 'Manage Complaints', path: '/admin/complaints', icon: ClipboardList },
              { name: 'Predictive Fleet Health', path: '/predictive-maintenance', icon: Activity },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Campus Facilities',
            links: [
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Lost & Found Hub', path: '/lost-found', icon: Search },
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle }
            ]
          },
          {
            section: 'Account & Safety',
            links: [
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];

      case 'student':
      default:
        return [
          {
            section: 'Student Community Hub',
            links: [
              { name: 'Student Community Hub', path: '/student', icon: Home },
              { name: 'Report Issue', path: '/complaint/new', icon: PlusCircle },
              { name: 'My Complaints', path: '/complaints', icon: FileText },
              { name: 'QR Scan', path: '/qr-report', icon: QrCode },
              { name: 'Attendance', path: '/attendance', icon: CalendarCheck2 },
              { name: 'Live Campus Chat', path: '/chat', icon: MessageSquare }
            ]
          },
          {
            section: 'Academic & Campus Hub',
            links: [
              { name: 'Notice Board', path: '/notices', icon: Bell },
              { name: 'Study Resources & Notes', path: '/resources', icon: BookOpen },
              { name: 'Study Pods', path: '/study-room', icon: Headphones },
              { name: 'Placements & Drives', path: '/placements', icon: Briefcase },
              { name: 'Lost & Found Hub', path: '/lost-found', icon: Search },
              { name: 'Faculty Directory', path: '/faculty-directory', icon: Users }
            ]
          },
          {
            section: 'Support & Profile',
            links: [
              { name: 'Emergency Center', path: '/emergency', icon: AlertTriangle, highlight: true },
              { name: 'Campus Feedback & Suggestions', path: '/feedback', icon: MessageSquare },
              { name: 'Profile', path: '/profile', icon: User }
            ]
          }
        ];
    }
  };

  const navSections = getNavSections();

  const roleThemeBadge = {
    student: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    faculty: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    hod: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    staff: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    teammember: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/40 font-black',
    admin: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40 font-black'
  };

  return (
    <>
      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 transform transition-all duration-300 ease-in-out w-64 flex flex-col shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Mini Identity Card */}
        {user && (
          <div className="mx-3 mt-3 mb-2 p-3.5 rounded-2xl bg-gradient-to-tr from-slate-50 to-brand-50/50 dark:from-[#131b2e] dark:to-[#0f172a] border border-slate-200/80 dark:border-slate-800 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md overflow-hidden border border-brand-200 dark:border-slate-700">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5 shadow-sm"></div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate" title={user.name}>
                  {user.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider border ${roleThemeBadge[user.role] || 'bg-slate-100 text-slate-700'}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Hide Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              <span className="truncate">{user.department || 'Campus Community'}</span>
              <span className="text-emerald-500 font-bold flex items-center gap-1 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3" /> Online
              </span>
            </div>
          </div>
        )}

        {/* Quick Tools */}
        <div className="px-3 pb-2 grid grid-cols-2 gap-2 flex-shrink-0">
          <button
            onClick={() => {
              if (onOpenSOS) onOpenSOS();
            }}
            className="px-2.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{t('SOS')}</span>
          </button>

          <button
            onClick={() => {
              if (onOpenAI) onOpenAI();
            }}
            className="px-2.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-purple-500" />
            <span>{t('AI Copilot')}</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-4 custom-scrollbar">
          {navSections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {t(sec.section)}
              </span>

              {sec.links.map(link => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/student' || link.path === '/admin' || link.path === '/faculty' || link.path === '/staff' || link.path === '/team-dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 dark:text-white'
                          : link.highlight
                          ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate">{t(link.name)}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b1120]/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>CampusFix Engine</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="Hide Sidebar"
          >
            Hide ⇥
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
