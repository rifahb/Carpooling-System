import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ userName }) => {
    return (
        <div>
            <h2>Welcome, {userName}!</h2>
            <div>
                <Link to="/create">Create Ride</Link>
                <Link to="/search">Search for Rides</Link>
            </div>
        </div>
    );
};

export default Home;