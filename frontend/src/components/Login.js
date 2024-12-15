import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setUserName }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });

            // Log the response to inspect its structure
            console.log('Response Data:', response.data);

            const { token, driverId } = response.data; // Destructure to get token and driverId

            if (token && driverId) {
                // Store token and driverId in localStorage and state
                localStorage.setItem('token', token);
                localStorage.setItem('driverId', driverId); // Store driverId in localStorage

                setToken(token);
                setUserName(`Driver ${driverId}`);  // Save the driver ID (or a custom message) to state
                setMessage('Login successful!');
            } else {
                setMessage('User not found or invalid response');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Invalid credentials, please try again.');
        }
    };

    return (
        <div>
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
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
