import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RideCreate from './components/RideCreate';
import RideSearch from './components/RideSearch';
import RideSearchResult from './components/RideSearchResult';
import ConfirmationPage from './components/ConfirmationPage';
import SetUserDetails from './components/SetUserDetails';
import LandingPage from './components/LandingPage';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [matchingRides, setMatchingRides] = useState([]);

    useEffect(() => {
        // Example API call to fetch matching rides
        const fetchRides = async () => {
            try {
                const response = await fetch('/api/rides');
                const data = await response.json();
                setMatchingRides(data);
            } catch (error) {
                console.error("Error fetching rides:", error);
            }
        };

        fetchRides();
    }, []);

    return (
        <Router>
            <div>
                <Routes>
                    {/* Landing Page Route */}
                    <Route
                        path="/"
                        element={token ? <Navigate to="/home" /> : <LandingPage />}
                    />

                    {/* Login and Register Routes */}
                    <Route path="/login" element={<Login setToken={setToken} setUserName={setUserName} />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/home" element={token ? <Home userName={userName} /> : <Navigate to="/" />} />
                    <Route path="/create" element={token ? <RideCreate /> : <Navigate to="/" />} />
                    <Route path="/search" element={token ? <RideSearch /> : <Navigate to="/" />} />
                    <Route path="/set-user-details" element={token ? <SetUserDetails /> : <Navigate to="/" />} />
                    <Route path="/ride-search-result" element={token ? <RideSearchResult matchingRides={matchingRides} /> : <Navigate to="/" />} />
                    <Route path="/confirmation" element={token ? <ConfirmationPage /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;