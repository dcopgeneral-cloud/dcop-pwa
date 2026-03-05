import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import ResidentLayout from './components/ResidentLayout';
import SurgeonLayout from './components/SurgeonLayout';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import InstitutionsScreen from './screens/InstitutionsScreen';
import SurgeonDashboard from './screens/surgeon/SurgeonDashboard';
import SurgeonCalendar from './screens/surgeon/SurgeonCalendar';
import SurgeonRoster from './screens/surgeon/SurgeonRoster';
import SurgeonProfile from './screens/surgeon/SurgeonProfile';
import { LogoMark } from './components/ProximieLogo';
import './App.css';

function Splash() {
  return (
    <div className="splash">
      <div className="splash-inner">
        <LogoMark size={48} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#f0f4ff', fontFamily: 'Inter, sans-serif' }}>Proximie</span>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontSize: 18, fontWeight: 500, color: '#5a7499', fontFamily: 'Inter, sans-serif' }}>DCoP</span>
        </div>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (role === 'surgeon') return <Navigate to="/surgeon" replace />;
  return <Navigate to="/home" replace />;
}

function PrivateRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/welcome" element={<PublicRoute><LandingScreen /></PublicRoute>} />
          <Route path="/login"   element={<PublicRoute><LoginScreen /></PublicRoute>} />

          {/* Resident routes */}
          <Route path="/" element={<PrivateRoute requiredRole="resident"><ResidentLayout /></PrivateRoute>}>
            <Route path="home"         element={<HomeScreen />} />
            <Route path="calendar"     element={<CalendarScreen />} />
            <Route path="institutions" element={<InstitutionsScreen />} />
            <Route path="notifications" element={<NotificationsScreen />} />
            <Route path="profile"      element={<ProfileScreen />} />
          </Route>

          {/* Surgeon routes */}
          <Route path="/surgeon" element={<PrivateRoute requiredRole="surgeon"><SurgeonLayout /></PrivateRoute>}>
            <Route index                    element={<SurgeonDashboard />} />
            <Route path="calendar"          element={<SurgeonCalendar />} />
            <Route path="roster/:caseId"    element={<SurgeonRoster />} />
            <Route path="profile"           element={<SurgeonProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
