import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentHome from './pages/StudentHome';
import NewComplaint from './pages/NewComplaint';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminOverview from './pages/AdminOverview';
import AdminComplaints from './pages/AdminComplaints';
import UserManagement from './pages/UserManagement';
import NoticeBoard from './pages/NoticeBoard';
import ResourceHub from './pages/ResourceHub';
import PlacementCenter from './pages/PlacementCenter';
import LostAndFound from './pages/LostAndFound';
import FeedbackForm from './pages/FeedbackForm';
import EmergencyCenter from './pages/EmergencyCenter';
import FacultyDirectory from './pages/FacultyDirectory';
import FacultyDashboard from './pages/FacultyDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Profile from './pages/Profile';
import QRReport from './pages/QRReport';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import SmartStudyRoom from './pages/SmartStudyRoom';

import CampusChat from './pages/CampusChat';
import AttendanceDashboard from './pages/AttendanceDashboard';
import AttendanceMark from './pages/AttendanceMark';
import AttendanceHistory from './pages/AttendanceHistory';
import AttendanceAnalytics from './pages/AttendanceAnalytics';
import AttendanceReports from './pages/AttendanceReports';
import AttendanceSettings from './pages/AttendanceSettings';

import TeamMemberDashboard from './pages/TeamMemberDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All logged-in users */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'hod', 'faculty', 'staff', 'teammember', 'admin']} />}>
              <Route path="/student" element={<StudentHome />} />
              <Route path="/attendance" element={<AttendanceDashboard />} />
              <Route path="/attendance/my" element={<AttendanceDashboard />} />
              <Route path="/attendance/mark" element={<AttendanceMark />} />
              <Route path="/attendance/history" element={<AttendanceHistory />} />
              <Route path="/attendance/calendar" element={<AttendanceHistory />} />
              <Route path="/attendance/analytics" element={<AttendanceAnalytics />} />
              <Route path="/attendance/reports" element={<AttendanceReports />} />
              <Route path="/attendance/settings" element={<AttendanceSettings />} />
              <Route path="/chat" element={<CampusChat />} />
              <Route path="/qr-report" element={<QRReport />} />
              <Route path="/qr" element={<QRReport />} />
              <Route path="/predictive-maintenance" element={<PredictiveMaintenance />} />
              <Route path="/maintenance" element={<PredictiveMaintenance />} />
              <Route path="/complaint/new" element={<NewComplaint />} />
              <Route path="/complaints/new" element={<NewComplaint />} />
              <Route path="/complaints" element={<MyComplaints />} />
              <Route path="/complaints/my" element={<MyComplaints />} />
              <Route path="/complaints/:id" element={<ComplaintDetails />} />
              <Route path="/complaint/:id" element={<ComplaintDetails />} />
              <Route path="/notices" element={<NoticeBoard />} />
              <Route path="/resources" element={<ResourceHub />} />
              <Route path="/placements" element={<PlacementCenter />} />
              <Route path="/placement" element={<PlacementCenter />} />
              <Route path="/lost-found" element={<LostAndFound />} />
              <Route path="/feedback" element={<FeedbackForm />} />
              <Route path="/emergency" element={<EmergencyCenter />} />
              <Route path="/faculty-directory" element={<FacultyDirectory />} />
              <Route path="/study-room" element={<SmartStudyRoom />} />
              <Route path="/smart-study-room" element={<SmartStudyRoom />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Team Member Command Center */}
            <Route element={<ProtectedRoute allowedRoles={['teammember', 'admin']} />}>
              <Route path="/team-dashboard" element={<TeamMemberDashboard />} />
              <Route path="/teammember" element={<TeamMemberDashboard />} />
            </Route>

            {/* Faculty / HOD */}
            <Route element={<ProtectedRoute allowedRoles={['faculty', 'hod', 'admin']} />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/hod" element={<FacultyDashboard />} />
            </Route>

            {/* Staff */}
            <Route element={<ProtectedRoute allowedRoles={['staff', 'admin', 'teammember']} />}>
              <Route path="/staff" element={<StaffDashboard />} />
            </Route>

            {/* Admin & Management Grievances Desk */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'teammember', 'hod', 'staff']} />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
