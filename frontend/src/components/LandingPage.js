import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import CSS for styling

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Blue Strip for Contact Info */}
            <div className="top-bar">
                <span className="contact-info">
                    <a href="mailto:support@carkaro.com">support@carkaro.com</a> | <a href="tel:+1234567890">Call Now</a>
                </span>
            </div>

            {/* Orange Strip for Logo and Buttons */}
            <div className="navbar">
                <img src={require('../logo3.png')} alt="CarKaro Logo" className="nav-logo" />
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="nav-link">Register</Link>
                </div>
            </div>

            {/* Hero Image Section */}
            <div className="hero-section">
                <img
                    src={require('../bg.jpeg')} // Replace with your hero image path
                    alt="Carpooling"
                    className="hero-image"
                />
                <div className="hero-overlay">
                    <h1>CarKaro</h1>
                    <p>Where Every Ride Counts</p>
                    <p>Easy. Affordable. Sustainable.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
