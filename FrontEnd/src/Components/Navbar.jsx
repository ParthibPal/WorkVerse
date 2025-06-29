import React, { useState, useEffect } from 'react';
import { Briefcase, Menu, X, LogOut, User, Settings, ChevronDown, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import authentication context

/**
 * Navbar Component
 * Main navigation component with authentication-aware rendering
 * Features:
 * - Responsive design with mobile menu
 * - User profile dropdown when logged in
 * - Authentication state management via AuthContext
 * - Dynamic navigation based on user type
 * - Admin users can access both admin and employer dashboards
 */
const Navbar = () => {
    const navigate = useNavigate();
    
    // Get authentication state and methods from context
    const { user, isAuthenticated, logout } = useAuth();
    
    // Local state for UI interactions
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.user-menu')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileDropdownOpen]);

    /**
     * Toggle mobile menu visibility
     */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    /**
     * Close mobile menu
     */
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    /**
     * Handle navigation with menu closing
     */
    const handleNavigation = (path) => {
        console.log(`Navigate to: ${path}`);
        closeMenu();
        navigate(path);
    };

    /**
     * Toggle profile dropdown visibility
     */
    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    /**
     * Handle user logout
     * Uses AuthContext logout method and redirects to home
     */
    const handleLogout = () => {
        // Use AuthContext logout method
        logout();
        
        // Close dropdowns
        setIsProfileDropdownOpen(false);
        closeMenu();
        
        // Redirect to home page
        navigate('/');
        
        // Optional: Show success message
        alert('Logged out successfully!');
    };

    /**
     * Check if current user is admin
     */
    const isAdmin = user?.isAdmin && user?.userType === 'admin';

    /**
     * Get navigation links based on user type
     * Different users see different navigation options
     * Admins can access both admin and employer features
     */
    const getNavLinks = () => {
        if (isAuthenticated()) {
            if (isAdmin) {
                // Admin users see both admin and employer options
                return [
                    { text: 'Admin Dashboard', path: '/admin-dashboard' },
                    { text: 'Employer Dashboard', path: '/dashboard' },
                    { text: 'Post Job', path: '/postjob' },
                    { text: 'Companies', path: '/companies' },
                    { text: 'About', path: '/aboutus' },
                    { text: 'Contact', path: '/contactus' }
                ];
            } else if (user?.userType === 'employer') {
                return [
                    { text: 'Dashboard', path: '/dashboard' },
                    { text: 'Post Job', path: '/postjob' },
                    { text: 'Companies', path: '/companies' },
                    { text: 'About', path: '/aboutus' },
                    { text: 'Contact', path: '/contactus' }
                ];
            } else {
                return [
                    { text: 'Find Jobs', path: '/home' },
                    { text: 'Companies', path: '/companies' },
                    { text: 'About', path: '/aboutus' },
                    { text: 'Contact', path: '/contactus' }
                ];
            }
        } else {
            return [
                { text: 'About', path: '/aboutus' },
                { text: 'Contact', path: '/contactus' }
            ];
        }
    };

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-brand" onClick={() => navigate("/")}>
                        <Briefcase className="brand-icon" />
                        <span className="brand-text">WorkVerse</span>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="nav-links desktop-nav">
                        {getNavLinks().map((link, index) => (
                            <a key={index} onClick={() => navigate(link.path)}>
                                {link.text}
                            </a>
                        ))}
                    </div>
                    
                    <div className="nav-buttons desktop-nav">
                        {isAuthenticated() ? (
                            <div className="user-menu">
                                <div className="user-trigger" onClick={toggleProfileDropdown}>
                                    <div className="user-avatar">
                                        {isAdmin ? <Shield size={16} /> : <User size={16} />}
                                    </div>
                                    <span className="user-name">{user?.name}</span>
                                    <ChevronDown size={16} className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotated' : ''}`} />
                                </div>
                                
                                {isProfileDropdownOpen && (
                                    <div className="profile-dropdown">
                                        <div className="dropdown-header">
                                            <div className="profile-info">
                                                <div className="profile-avatar">
                                                    {isAdmin ? <Shield size={20} /> : <User size={20} />}
                                                </div>
                                                <div className="profile-details">
                                                    <h4>{user?.name}</h4>
                                                    <p>{user?.email}</p>
                                                    <span className="user-type">
                                                        {isAdmin ? 'Administrator' : user?.userType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-menu">
                                            {isAdmin && (
                                                <>
                                                    <button className="dropdown-item" onClick={() => navigate('/admin-dashboard')}>
                                                        <Shield size={16} />
                                                        Admin Dashboard
                                                    </button>
                                                    <button className="dropdown-item" onClick={() => navigate('/dashboard')}>
                                                        <Briefcase size={16} />
                                                        Employer Dashboard
                                                    </button>
                                                </>
                                            )}
                                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                                <User size={16} />
                                                My Profile
                                            </button>
                                            <button className="dropdown-item" onClick={() => navigate('/settings')}>
                                                <Settings size={16} />
                                                Settings
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item logout-item" onClick={handleLogout}>
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="btn-secondary" onClick={()=>navigate('/login')}>Sign In</button>
                                <button className="btn-primary" onClick={()=>navigate('/login')}>Sign Up</button>
                            </>
                        )}
                    </div>

                    {/* Mobile Burger Menu Button */}
                    <button className="burger-menu" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="mobile-menu-overlay" onClick={closeMenu}>
                        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                            <div className="mobile-nav-links">
                                {getNavLinks().map((link, index) => (
                                    <a key={index} onClick={() => handleNavigation(link.path)}>
                                        {link.text}
                                    </a>
                                ))}
                            </div>
                            <div className="mobile-nav-buttons">
                                {isAuthenticated() ? (
                                    <div className="mobile-user-menu">
                                        <div className="mobile-profile-section">
                                            <div className="mobile-profile-info">
                                                <div className="mobile-profile-avatar">
                                                    {isAdmin ? <Shield size={20} /> : <User size={20} />}
                                                </div>
                                                <div className="mobile-profile-details">
                                                    <h4>{user?.name}</h4>
                                                    <p>{user?.email}</p>
                                                    <span className="mobile-user-type">
                                                        {isAdmin ? 'Administrator' : user?.userType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mobile-profile-actions">
                                            {isAdmin && (
                                                <>
                                                    <button className="mobile-profile-btn" onClick={() => navigate('/admin-dashboard')}>
                                                        <Shield size={16} />
                                                        Admin Dashboard
                                                    </button>
                                                    <button className="mobile-profile-btn" onClick={() => navigate('/dashboard')}>
                                                        <Briefcase size={16} />
                                                        Employer Dashboard
                                                    </button>
                                                </>
                                            )}
                                            <button className="mobile-profile-btn" onClick={() => navigate('/profile')}>
                                                <User size={16} />
                                                My Profile
                                            </button>
                                            <button className="mobile-profile-btn" onClick={() => navigate('/settings')}>
                                                <Settings size={16} />
                                                Settings
                                            </button>
                                            <button className="mobile-logout-btn" onClick={handleLogout}>
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button className="btn-secondary" onClick={()=>navigate('/login')}>Sign In</button>
                                        <button className="btn-primary" onClick={()=>navigate('/login')}>Sign Up</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <style jsx>{`
                /* Navigation Styles */
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(15, 32, 39, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem 0;
                    transition: all 0.3s ease;
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem
                }

                .nav-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fcd29f;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .nav-brand:hover {
                    color: #d4a574;
                }

                .brand-icon {
                    color: #d4a574;
                }

                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }

                .nav-links a,
                .nav-link-btn {
                    color: #e0e6ed;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    position: relative;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: inherit;
                    font-family: inherit;
                    
                }

                .nav-links a:hover,
                .nav-link-btn:hover {
                    color: #fcd29f;
                }

                .nav-links a::after,
                .nav-link-btn::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #d4a574;
                    transition: width 0.3s ease;
                }

                .nav-links a:hover::after,
                .nav-link-btn:hover::after {
                    width: 100%;
                }

                .nav-buttons {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .user-menu {
                    position: relative;
                }

                .user-trigger {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .user-trigger:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(252, 210, 159, 0.3);
                    transform: translateY(-1px);
                }

                .user-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, rgba(252, 210, 159, 0.2), rgba(212, 160, 86, 0.2));
                    border-radius: 50%;
                    color: #fcd29f;
                }

                .user-name {
                    color: #fcd29f;
                    font-weight: 600;
                    font-size: 0.95rem;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }

                .dropdown-arrow {
                    color: #fcd29f;
                    transition: transform 0.3s ease;
                }

                .dropdown-arrow.rotated {
                    transform: rotate(180deg);
                }

                .profile-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 0.5rem;
                    background: rgba(15, 32, 39, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    min-width: 280px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    animation: dropdownSlide 0.3s ease;
                    z-index: 1001;
                }

                @keyframes dropdownSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dropdown-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .profile-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .profile-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, rgba(252, 210, 159, 0.2), rgba(212, 160, 86, 0.2));
                    border-radius: 50%;
                    color: #fcd29f;
                }

                .profile-details h4 {
                    margin: 0 0 0.25rem 0;
                    color: #f5f5f5;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .profile-details p {
                    margin: 0 0 0.5rem 0;
                    color: #ccc;
                    font-size: 0.875rem;
                }

                .user-type {
                    background: rgba(252, 210, 159, 0.2);
                    color: #fcd29f;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .dropdown-menu {
                    padding: 0.5rem;
                }

                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: none;
                    border: none;
                    color: #e0e6ed;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-align: left;
                    font-family: inherit;
                }

                .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fcd29f;
                }

                .dropdown-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0.5rem 0;
                }

                .logout-item {
                    color: #ff6b6b;
                }

                .logout-item:hover {
                    background: rgba(220, 53, 69, 0.1);
                    color: #dc3545;
                }

                .btn-secondary {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #e0e6ed;
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: #fcd29f;
                    color: #fcd29f;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #fcd29f, #d4a574);
                    border: none;
                    color: #0f2027;
                    padding: 0.5rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: inherit;
                }

                .btn-primary:hover {
                    background: linear-gradient(135deg, #d4a574, #b8956a);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(252, 210, 159, 0.3);
                }

                /* Burger Menu */
                .burger-menu {
                    display: none;
                    background: none;
                    border: none;
                    color: #e0e6ed;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }

                .burger-menu:hover {
                    color: #fcd29f;
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Mobile Menu */
                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    padding-top: 80px;
                }

                .mobile-menu {
                    background: rgba(15, 32, 39, 0.98);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    margin: 1rem;
                    padding: 2rem;
                    min-width: 250px;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .mobile-nav-links a,
                .mobile-nav-link-btn {
                    color: #e0e6ed;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: none;
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    cursor: pointer;
                    font-size: inherit;
                    width: 100%;
                    text-align: left;
                    font-family: inherit;
                }

                .mobile-nav-links a:hover,
                .mobile-nav-link-btn:hover {
                    color: #fcd29f;
                    border-bottom-color: #fcd29f;
                }

                .mobile-nav-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .mobile-nav-buttons .btn-secondary,
                .mobile-nav-buttons .btn-primary {
                    width: 100%;
                    text-align: center;
                }

                .mobile-user-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .mobile-profile-section {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .mobile-profile-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .mobile-profile-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, rgba(252, 210, 159, 0.2), rgba(212, 160, 86, 0.2));
                    border-radius: 50%;
                    color: #fcd29f;
                }

                .mobile-profile-details h4 {
                    margin: 0 0 0.25rem 0;
                    color: #f5f5f5;
                    font-size: 1rem;
                    font-weight: 600;
                }

                .mobile-profile-details p {
                    margin: 0 0 0.5rem 0;
                    color: #ccc;
                    font-size: 0.875rem;
                }

                .mobile-user-type {
                    background: rgba(252, 210, 159, 0.2);
                    color: #fcd29f;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .mobile-profile-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .mobile-profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #e0e6ed;
                    font-size: 0.9rem;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-align: left;
                    font-family: inherit;
                }

                .mobile-profile-btn:hover {
                    background: rgba(255, 255, 255, 0.08);
                    color: #fcd29f;
                    border-color: rgba(252, 210, 159, 0.3);
                }

                .mobile-logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.05));
                    border: 1px solid rgba(220, 53, 69, 0.4);
                    color: #ff6b6b;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-align: left;
                    font-family: inherit;
                }

                .mobile-logout-btn:hover {
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.25), rgba(220, 53, 69, 0.15));
                    border-color: #dc3545;
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .nav-container {
                        padding: 0 1rem;
                        display: flex;
                        justify-content: center;
                        gap: 43vw;
                    }

                    .desktop-nav {
                        display: none;
                    }

                    .burger-menu {
                        display: block;
                    }
                }

                @media (max-width: 480px) {
                    .nav-container {
                        padding: 0 0.5rem;
                    }

                    .mobile-menu {
                        margin: 0.5rem;
                        padding: 1.5rem;
                        min-width: calc(70vw - 1rem);
                    }

                    .mobile-menu-overlay {
                        padding-top: 70px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Navbar;