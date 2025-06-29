import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  UserCheck, 
  UserX, 
  Briefcase, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../Css/AdminDashboard.css';

/**
 * AdminDashboard Component
 * Comprehensive admin panel with user management and statistics
 * Features:
 * - User statistics overview
 * - User management (view, activate/deactivate)
 * - Search and filter functionality
 * - Admin-specific actions
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});

  /**
   * Fetch dashboard data on component mount
   */
  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  /**
   * Fetch admin dashboard statistics
   */
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Fetch all users for management
   */
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle user active status
   */
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));

      // Refresh dashboard data
      fetchDashboardData();
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Toggle password visibility for a specific user
   */
  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  /**
   * Handle admin logout
   */
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  /**
   * Filter users based on search term and filter type
   */
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || user.userType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  /**
   * Animation variants
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <motion.header 
        className="admin-header"
        initial="hidden"
        animate="visible"
        variants={itemVariants}
      >
        <div className="header-left">
          <Shield size={32} className="admin-icon" />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.header>

      {/* Error Display */}
      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      {/* Statistics Cards */}
      {dashboardData && (
        <motion.div 
          className="stats-grid"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="stat-card" variants={itemVariants}>
            <div className="stat-icon total-users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" variants={itemVariants}>
            <div className="stat-icon jobseekers">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.totalJobseekers}</h3>
              <p>Job Seekers</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" variants={itemVariants}>
            <div className="stat-icon employers">
              <Briefcase size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.totalEmployers}</h3>
              <p>Employers</p>
            </div>
          </motion.div>

          <motion.div className="stat-card" variants={itemVariants}>
            <div className="stat-icon admins">
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <h3>{dashboardData.stats.totalAdmins}</h3>
              <p>Administrators</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* User Management Section */}
      <motion.div 
        className="user-management"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="section-header">
          <h2>User Management</h2>
          <div className="controls">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              <option value="jobseeker">Job Seekers</option>
              <option value="employer">Employers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr 
                  key={user._id}
                  variants={itemVariants}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-type ${user.userType}`}>
                      {user.userType}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className={`status-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                      >
                        {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 