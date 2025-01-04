/*import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ userName }) => {
    return (
        <div>
            <h2>Welcome, {userName}!</h2>
            <div>
                <Link to="/create">Create Ride</Link>
                <Link to="/search">Search for Rides</Link>
            
             
                <Link to="/set-user-details">
                <button>Set Your User Details</button>
            </Link>
            </div>
        </div>
    );
};

export default Home;*/
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
    const [userName, setUserName] = useState('');
    const driverId = localStorage.getItem('driverId'); // Retrieve the driver ID
    const navigate = useNavigate();

    // Fetch user name from the server using driverId
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${driverId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        };

        if (driverId) {
            fetchUserName();
        }
    }, [driverId]);

    const handleLogout = () => {
        // Clear localStorage and navigate to login page
        localStorage.removeItem('token');
        localStorage.removeItem('driverId');
        alert('Logged out successfully');
        navigate('/');
    };

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="home-nav">
                <Link to="/set-user-details" className="nav-link">
                   <button className="userbutton"> Set User Details</button>
                </Link>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </nav>

            {/* Welcome Section */}
            <div className="welcome-section">
                <h2>Welcome, {userName || 'Driver'}!</h2>
                <div className="home-content">
                    {/* Image Section */}
                    <div className="home-image">
                        <img
                            src={require('../homebg.webp')} // Replace with your image path
                            alt="Ride Sharing Illustration"
                        />
                    </div>

                    {/* Buttons Section */}
                    <div className="home-buttons">
                        <Link to="/create" className="home-button">
                            Create a Ride
                        </Link>
                        <Link to="/search" className="home-button">
                            Book a Ride
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

