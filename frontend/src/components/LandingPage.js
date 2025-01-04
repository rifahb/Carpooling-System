import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import CSS for styling

const LandingPage = () => {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <img src={require('../logo3.png')} alt="Logo" className="landing-logo" />
                <h1>Welcome to CarKaro</h1>
            </header>

            <div className="landing-content">
                <p>Easy. Affordable. Sustainable.</p>
                <div className="landing-buttons">
                    <Link to="/login" className="landing-button">Login</Link>
                    <Link to="/register" className="landing-button">Register</Link>
                </div>
            </div>

            <img
                src={require('../bg.jpeg')} // Replace with your hero image path
                alt="Carpooling"
                className="landing-image"
            />
        </div>
    );
};

export default LandingPage;
