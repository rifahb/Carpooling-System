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
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RideCreate from './components/RideCreate';  // If you have this component
import RideSearch from './components/RideSearch'; 

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

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
                </Routes>
            </div>
        </Router>
    );
};

export default App;