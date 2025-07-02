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
import CompanyRegistrationPage from './Pages/CompanyRegistrationPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import MyJobsPage from './Pages/MyJobsPage.jsx';
import JobsPage from './Pages/JobsPage.jsx';
import JobDetailPage from './Pages/JobDetailPage.jsx';

/**
 * App Component
 * Main application component that sets up routing and authentication
 * 
 * Route Structure:
 * - Public routes: Landing, Login, AdminLogin, About, Contact, CompanyRegistration
 * - Protected routes: Dashboard (employers), Home (jobseekers), PostJob, Companies, Profile
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
        <Route path="/register-company" element={<CompanyRegistrationPage />} />
        
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

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/my-jobs" 
          element={
            <ProtectedRoute requiredUserType="employer">
              <MyJobsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/jobs" 
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/jobs/:jobId" 
          element={
            <ProtectedRoute>
              <JobDetailPage />
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
