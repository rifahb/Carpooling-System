/*import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Correct import
import Navbar from './components/Navbar';
import RideSearch from './components/RideSearch';
import RideBooking from './components/RideBooking';
import RideCreate from './components/RideCreate';
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>  { Use Routes here */
              /*  <Route path="/" element={<h1>Welcome to the Carpooling System</h1>} />
                <Route path="/search" element={<RideSearch />} />
                <Route path="/book/:rideId" element={<RideBooking />} />
                <Route path="/create" element={<RideCreate />} />  {/* Add the new route */
            /*</Routes>
        </Router>
    );
};

export default App;*/
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RideCreate from './components/RideCreate';  // If you have this component
import RideSearch from './components/RideSearch'; 
import RideSearchResult from './components/RideSearchResult';
import ConfirmationPage from './components/ConfirmationPage';
import SetUserDetails from './components/SetUserDetails';
const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
    const [matchingRides, setMatchingRides] = useState([]);

    useEffect(() => {
        // Example API call to fetch matching rides
        const fetchRides = async () => {
            const response = await fetch('/api/rides');
            const data = await response.json();
            setMatchingRides(data);
        };

        fetchRides();
    }, []);
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/home">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </nav>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} setUserName={setUserName} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={token ? <Home userName={userName} /> : <Navigate to="/login" />} />
                    <Route path="/create" element={token ? <RideCreate /> : <Navigate to="/login" />} />
                    <Route path="/search" element={token ? <RideSearch /> : <Navigate to="/login" />} />
                    <Route path="/set-user-details" element={<SetUserDetails />} /> 
                    <Route path="/ride-search-result" element={<RideSearchResult matchingRides={matchingRides} />} />


                <Route path="/ride-search" element={<RideSearchResult/>} />
                <Route path="/confirmation" element={<ConfirmationPage/>} />
            
                </Routes>
            </div>
        </Router>
    );
};

export default App;