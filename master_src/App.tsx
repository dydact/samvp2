import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './hooks/useAuth'; 
import RootLayout from './app/layout';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import FinanceManagement from './pages/FinanceManagement';
import TaskAssignment from './components/TaskAssignment';
import Calendar from './components/Calendar';
import TaskR from './components/TaskR';
import ClientManagement from './pages/ClientManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import Personnel from './pages/Personnel';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { createGlobalStyle } from 'styled-components';
import { DevModeToggle } from './components/DevModeToggle';

// Lazy load other components
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const ActivityRecognition = lazy(() => import('./pages/ActivityRecognition'));
const AnomalyDetection = lazy(() => import('./pages/AnomalyDetection'));
const PatientMonitoring = lazy(() => import('./pages/PatientMonitoring'));
const TreatmentPlans = lazy(() => import('./pages/TreatmentPlans'));
const DataAnalytics = lazy(() => import('./pages/DataAnalytics').then(module => ({ default: module.default })));
const AlertsNotifications = lazy(() => import('./pages/AlertsNotifications').then(module => ({ default: module.default })));
const PrivacySecurity = lazy(() => import('./pages/PrivacySecurity').then(module => ({ default: module.default })));
const PayrollBilling = lazy(() => import('./pages/PayrollBilling').then(module => ({ default: module.default })));
const TimeTracking = lazy(() => import('./pages/TimeTracking').then(module => ({ default: module.default })));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const LoadingFallback = () => <div>Loading...</div>;

const AppContent: React.FC = () => {
  const { user, signOut, isLoading } = useAuth(); 
  const [isDevMode, setIsDevMode] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    setIsDevMode(isDev);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('App Error:', error);
    }
  }, [error]);

  if (isLoading) { 
    return <LoadingFallback />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <RootLayout 
        handleSignOut={signOut} 
        setShowAuthPopup={() => {}} // You might need to implement this
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics isSignedIn={user !== null} handleSignOut={signOut} /></ProtectedRoute>} />
            <Route path="/finance" element={<ProtectedRoute><FinanceManagement isSignedIn={user !== null} handleSignOut={signOut} /></ProtectedRoute>} />
            <Route path="/task-assignment" element={<ProtectedRoute><TaskAssignment onAssignmentComplete={() => {}} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar tasks={[]} onTaskUpdate={() => console.log('Task updated')} /></ProtectedRoute>} />
            <Route path="/taskr" element={<ProtectedRoute><TaskR /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientManagement /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/personnel" element={<ProtectedRoute><Personnel /></ProtectedRoute>} />
            <Route path="/video-analysis" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><VideoAnalysis /></Suspense></ProtectedRoute>} />
            <Route path="/activity-recognition" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><ActivityRecognition /></Suspense></ProtectedRoute>} />
            <Route path="/anomaly-detection" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AnomalyDetection /></Suspense></ProtectedRoute>} />
            <Route path="/patient-monitoring" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><PatientMonitoring /></Suspense></ProtectedRoute>} />
            <Route path="/treatment-plans" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><TreatmentPlans /></Suspense></ProtectedRoute>} />
            <Route path="/data-analytics" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><DataAnalytics /></Suspense></ProtectedRoute>} />
            <Route path="/alerts-notifications" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><AlertsNotifications /></Suspense></ProtectedRoute>} />
            <Route path="/privacy-security" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><PrivacySecurity /></Suspense></ProtectedRoute>} />
            <Route path="/payroll-billing" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><PayrollBilling /></Suspense></ProtectedRoute>} />
            <Route path="/time-tracking" element={<ProtectedRoute><Suspense fallback={<LoadingFallback />}><TimeTracking /></Suspense></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </RootLayout>
      {isDevMode && <DevModeToggle />}
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <ErrorBoundary>
        <AuthProvider> 
          <AppContent /> 
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;