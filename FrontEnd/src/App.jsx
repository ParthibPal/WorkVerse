import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx';
import Login from './Pages/AuthForm.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import HomePage from './Pages/HomePage.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import PostJobPage from './Pages/PostJobPage.jsx';
import CompaniesPage from './Pages/CompaniesPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactPage />} />
      <Route path="/postjob" element={<PostJobPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
    </Routes>
  );
}

export default App;
