import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  AlertTriangle,
  ShieldAlert,
  Bot,
  ChevronDown,
  Sparkles,
  Zap,
  PanelLeftClose,
  PanelLeft,
  QrCode,
  Clock,
  CloudSun,
  CheckCircle2,
  Activity,
  Globe,
  Check
} from 'lucide-react';
import api from '../services/api';

const Navbar = ({ onToggleSidebar, sidebarOpen, onOpenSOS, onOpenAI }) => {
  const { user, login, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage, t, currentLanguage } = useLanguage();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const langMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleClickOutside = (e) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // silent fallback
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-read');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const roleBadgeStyle = {
    student: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    faculty: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    hod: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    staff: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
    teammember: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-500/40 font-extrabold',
    admin: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/40 font-extrabold'
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-2xl transition-all duration-300 shadow-sm">
      <div className="h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left Side: Sidebar Toggle & Brand Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/90 transition flex items-center justify-center cursor-pointer border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 hover:border-brand-500/40"
            title={sidebarOpen ? "Hide Sidebar Navigation" : "Show Sidebar Navigation"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            ) : (
              <PanelLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Brand Logo with Glowing Gradient */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
                  {t('CampusFix')}
                </span>
                <span className="inline-block text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/30">
                  v2.5 AI
                </span>
              </div>
              <span className="hidden sm:block text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                {t('Smart Problem Solving by Team Shubham')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Campus Status & Clock Widget (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 text-xs font-semibold backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t('AI Core Active')}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>27°C Campus</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-mono font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>

        {/* Right Side: Language Switcher, Action Pills & User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* ================= UNIVERSAL LANGUAGE SELECTOR DROPDOWN ================= */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Change Portal Language (भाषा बदलें)"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 animate-pulse" />
              <span className="text-xs">{currentLanguage?.flag}</span>
              <span className="hidden sm:inline text-xs font-extrabold">{currentLanguage?.native || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 overflow-hidden animate-scale-in">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Language / भाषा
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        language === l.code
                          ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 font-black'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{l.flag}</span>
                        <span>{l.label}</span>
                      </div>
                      {language === l.code && (
                        <Check className="w-3.5 h-3.5 text-brand-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 1-Tap QR Report Quick Link */}
          <Link
            to="/qr-report"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs border border-slate-200 dark:border-slate-800"
            title="1-Tap QR Problem Report"
          >
            <QrCode className="w-3.5 h-3.5 text-brand-500" />
            <span>{t('QR Scan')}</span>
          </Link>

          {/* AI Diagnostic Assistant Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-brand-600/15 hover:from-purple-600/25 hover:to-brand-600/25 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-extrabold transition shadow-xs cursor-pointer group active:scale-95"
            title="Campus AI Copilot"
          >
            <Bot className="w-4 h-4 text-purple-500 animate-bounce" />
            <span className="hidden sm:inline">{t('AI Copilot')}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-black">AI</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-extrabold transition shadow-xs cursor-pointer active:scale-95"
            title="Campus Emergency SOS Desk"
          >
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">{t('SOS')}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            title="Toggle Dark / Light Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" /> : <Moon className="w-4 h-4 text-indigo-500 hover:-rotate-12 transition-transform" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition relative cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              title={t('Notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/50 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 overflow-hidden animate-scale-in">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t('Campus Alerts')}</h4>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-500 dark:text-rose-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-bold"
                    >
                      {t('Mark all as read')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t('No notifications yet')}
                    </div>
                  ) : (
                    notifications.map(n => (
                      <Link
                        key={n._id || Math.random()}
                        to={n.linkUrl || '#'}
                        onClick={() => setShowNotifications(false)}
                        className={`p-3.5 block hover:bg-slate-50 dark:hover:bg-slate-800/60 transition ${!n.isRead ? 'bg-brand-500/5 dark:bg-brand-500/10' : ''}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">
                            {n.type === 'Complaint' ? (
                              <ShieldAlert className="w-4 h-4 text-brand-500" />
                            ) : (
                              <Bell className="w-4 h-4 text-emerald-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge & Dropdown */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md overflow-hidden border border-white/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <span className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase border ${roleBadgeStyle[user.role] || 'bg-slate-100 text-slate-700'}`}>
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-scale-in">
                  <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow overflow-hidden flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded capitalize border ${roleBadgeStyle[user.role] || 'bg-slate-100 text-slate-700'}`}>
                        {user.role} • {user.department}
                      </span>
                    </div>
                  </div>

                  {/* Quick Switch Role Option */}
                  <div className="py-2 px-3 border-t border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
                      ⚡ Quick Switch Role / Portal
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { r: 'student', name: 'Student', path: '/student', email: 'student@campusfix.edu' },
                        { r: 'faculty', name: 'Faculty', path: '/faculty', email: 'faculty@campusfix.edu' },
                        { r: 'hod', name: 'HOD', path: '/hod', email: 'hod@campusfix.edu' },
                        { r: 'staff', name: 'Staff', path: '/staff', email: 'staff@campusfix.edu' },
                        { r: 'teammember', name: 'Team', path: '/team-dashboard', email: 'team@campusfix.edu' },
                        { r: 'admin', name: 'Admin', path: '/admin', email: 'shubhammishra23082004@gmail.com' }
                      ].map(item => (
                        <button
                          key={item.r}
                          type="button"
                          onClick={async () => {
                            setShowUserMenu(false);
                            try {
                              await login(item.email, item.r === 'admin' ? 'shubham@123' : 'password123');
                              navigate(item.path);
                            } catch (e) {
                              navigate(item.path);
                            }
                          }}
                          className={`px-1.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer text-center truncate ${
                            user.role === item.r
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition"
                    >
                      <UserIcon className="w-4 h-4 text-brand-500" />
                      <span>{t('Profile')} &amp; Digital ID</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{t('Logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs font-black transition shadow-md shadow-brand-500/25"
            >
              {t('Sign In')}
            </Link>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
