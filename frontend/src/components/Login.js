import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = ({ setToken, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

            // Log the response to inspect its structure
            console.log('Response Data:', response.data);

            const { token, driverId } = response.data; 
            await axios.delete('http://localhost:5000/api/rides/deleteExpiredRides');
            console.log('Expired rides deleted successfully');// Destructure to get token and driverId

            if (token && driverId) {
                // Store token and driverId in localStorage and state
                localStorage.setItem('token', token);
                localStorage.setItem('driverId', driverId); // Store driverId in localStorage

                setToken(token);
                setUserName(`Driver ${driverId}`); // Save the driver ID (or a custom message) to state
                setMessage('Login successful!');
                navigate('/home'); // Navigate to home on successful login
            } else {
                setMessage('User not found or invalid response');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Invalid credentials, please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="overlay"></div> {/* To reduce the brightness of the background */}
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <button className="home-button" onClick={() => navigate('/home')}>Go to Home</button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;
