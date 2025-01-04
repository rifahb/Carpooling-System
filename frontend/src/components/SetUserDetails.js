import React, { useState } from 'react';
import axios from 'axios';
import './SetUserDetails.css'; // Import the CSS file

const SetUserDetails = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [car, setCar] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to set your details.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/set-user-details',
                { phoneNumber, car, carNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setMessage(response.data.message || 'User details saved successfully!');
        } catch (error) {
            setMessage('Error saving user details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="set-user-details">
            <h3>Set Your User Details</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Car Model:</label>
                    <input
                        type="text"
                        value={car}
                        onChange={(e) => setCar(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Car Number:</label>
                    <input
                        type="text"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                        required
                    />
                </div>
                <button className="setting" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Details'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetUserDetails;
