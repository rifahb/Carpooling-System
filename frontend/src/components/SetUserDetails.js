import React, { useState } from 'react';
import axios from 'axios';

const SetUserDetails = () => {
    // States for storing input values
    const [phoneNumber, setPhoneNumber] = useState('');
    const [car, setCar] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission

        // Retrieve the driverId from localStorage (assuming it's saved during login)
        const driverId = localStorage.getItem('driverId');

        if (!driverId) {
            setMessage('You must be logged in to set your details.');
            return;
        }

        // Send POST request to save the user details
        try {
            const response = await axios.post(
                'http://localhost:5000/api/users/set-user-details', 
                { driverId, phoneNumber, car, carNumber }
            );

            // Set success message if request is successful
            setMessage(response.data.message || 'User details saved successfully!');
        } catch (error) {
            // Set error message if request fails
            setMessage('Error saving user details.');
        }
    };

    return (
        <div>
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
                <button type="submit">Save Details</button>
            </form>

            {/* Display any messages (success or error) */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default SetUserDetails;
