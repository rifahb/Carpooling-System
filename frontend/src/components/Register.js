import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import the CSS file

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/api/users/register', { name, email, password });
            setMessage('Registration successful, you can now log in!');
        } catch (error) {
            setMessage('Error during registration. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="overlay"></div> {/* Dimmed background */}
            <div className="register-box">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <button type="submit" className="register-button">Register</button>
                </form>
                <button
                    className="login-button"
                    onClick={() => navigate('/login')} // Navigate to login page
                >
                     Login
                </button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Register;
