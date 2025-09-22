// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Page Imports
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Media from './pages/Media';
import GoogleCallback from './pages/GoogleCallback';
import Settings from './pages/Settings'; // ✅ NEW Settings page

// -----------------------------------------------------------------------------
// Protected / Public Route Wrappers
// -----------------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// -----------------------------------------------------------------------------
// App Routes
// -----------------------------------------------------------------------------
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/auth/google/callback" element={<GoogleCallback />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
    {/* ✅ NEW SETTINGS ROUTE */}
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

// -----------------------------------------------------------------------------
// Main App Component
// -----------------------------------------------------------------------------
const App = () => {
  return (
    <AuthProvider>
      {/* Global Toast Notifications */}
      <ToastContainer theme="dark" />
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
