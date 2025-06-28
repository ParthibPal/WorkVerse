import React from 'react';
import { Briefcase} from 'lucide-react';
import "../Css/Component/Footer.css"
const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-brand">
                            <Briefcase size={24} />
                            <span>WorkVerse</span>
                        </div>
                        <p>Connecting talent with opportunity since 2020</p>
                    </div>
                    <div className="footer-section">
                        <h4>For Job Seekers</h4>
                        <ul>
                            <li><a href="#browse">Browse Jobs</a></li>
                            <li><a href="#companies">Companies</a></li>
                            <li><a href="#resources">Career Resources</a></li>
                            <li><a href="#resume">Resume Builder</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>For Employers</h4>
                        <ul>
                            <li><a href="#post">Post a Job</a></li>
                            <li><a href="#candidates">Browse Candidates</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#tools">Hiring Tools</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 JobPortal. All rights reserved.</p>
                </div>
            </footer>
        </>
    )
}
export default Footer;