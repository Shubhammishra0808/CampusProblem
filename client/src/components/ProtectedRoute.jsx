import React, { useContext, useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EmergencySOSModal from './EmergencySOSModal';
import AIAssistantModal from './AIAssistantModal';
import CampusBroadcastTicker from './CampusBroadcastTicker';
import BreadcrumbBar from './BreadcrumbBar';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useContext(AuthContext);
  // Default open on wide desktop screens (>=1024px), closed on small mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth >= 1024;
  });
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const location = useLocation();

  const storedToken = token || localStorage.getItem('campusfix_token');
  let currentUser = user;
  if (!currentUser) {
    try {
      currentUser = JSON.parse(localStorage.getItem('campusfix_user') || 'null');
    } catch (e) {
      currentUser = null;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Loading CampusFix...</p>
        </div>
      </div>
    );
  }

  if (!storedToken || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'teammember') return <Navigate to="/team-dashboard" replace />;
    if (currentUser.role === 'hod' || currentUser.role === 'faculty') return <Navigate to="/faculty" replace />;
    if (currentUser.role === 'staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
      
      {/* Top Fixed Navbar with Universal Sidebar Toggle Button */}
      <Navbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSOS={() => setSosModalOpen(true)}
        onOpenAI={() => setAiModalOpen(true)}
      />
      
      <div className="flex-1 flex relative">
        
        {/* Collapsible / Dismissable Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSOS={() => setSosModalOpen(true)}
          onOpenAI={() => setAiModalOpen(true)}
        />

        {/* Dynamic Main Workspace Container: expands full width when sidebar is hidden */}
        <main
          className={`flex-1 transition-all duration-300 min-w-0 ${
            sidebarOpen ? 'lg:pl-64' : 'pl-0'
          }`}
        >
          <div key={location.pathname} className="page-animate p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
            {/* Live Campus Announcement Ticker */}
            <CampusBroadcastTicker />

            {/* Universal Breadcrumb & Back Navigation Bar */}
            <BreadcrumbBar />
            
            <Outlet />
          </div>
        </main>

      </div>

      {/* Global Emergency SOS Life Safety Modal */}
      <EmergencySOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        user={user}
      />

      {/* Global Campus AI Diagnostic Assistant Modal */}
      <AIAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default ProtectedRoute;
