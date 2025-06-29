import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

// Import all page components
import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/AuthForm.jsx';
import AdminLogin from './Pages/AdminLogin.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import HomePage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import PostJobPage from './Pages/PostJobPage.jsx';
import CompaniesPage from './Pages/CompaniesPage.jsx';

/**
 * App Component
 * Main application component that sets up routing and authentication
 * 
 * Route Structure:
 * - Public routes: Landing, Login, AdminLogin, About, Contact
 * - Protected routes: Dashboard (employers), Home (jobseekers), PostJob, Companies
 * - Admin routes: AdminDashboard (admin only)
 * - User-specific routes: Dashboard (employers), Home (jobseekers)
 */
function App() {
  return (
    // Wrap entire app with AuthProvider to provide authentication context
    <AuthProvider>
      <Routes>
        {/* Public Routes - Anyone can access */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactPage />} />
        
        {/* Protected Routes - Require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredUserType="employer">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/home" 
          element={
            <ProtectedRoute requiredUserType="jobseeker">
              <HomePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/postjob" 
          element={
            <ProtectedRoute requiredUserType="employer">
              <PostJobPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/companies" 
          element={
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes - Require admin authentication */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredUserType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
