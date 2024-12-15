import React, { useState } from 'react';
import axios from 'axios';



const RideCreate = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [availableSeats, setAvailableSeats] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const driverId = localStorage.getItem('driverId');
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to create a ride.');
            return;
        }
        console.log('Submitted Data:', { token,driverId,pickupLocation, dropOffLocation, availableSeats });

        if (!driverId) {
        setMessage('Driver ID not found.');
        return;
    }
        try {
            console.log('Submitted Data:', { pickupLocation, dropOffLocation, availableSeats });
            const response = await axios.post(
                'http://localhost:5000/api/rides/create',
                {
                    driverId, // Replace with dynamic driver ID if available
                    pickupLocation,
                    dropOffLocation,
                    availableSeats,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage('Ride created successfully!');
            setPickupLocation('');
            setDropOffLocation('');
            setAvailableSeats('');
        } catch (error) {
            console.error('Error creating ride:', error);
            if (error.response?.status === 400) {
                setMessage('Invalid pickup or drop-off location. Please try again.');
            } else if (error.response?.status === 401) {
                setMessage('Authentication failed. Please log in again.');
            } else {
                setMessage('Error creating ride. Please try again.');
            }
        }
    };

    return (
        <div>
            <h3>Create a New Ride</h3>
            <form onSubmit={handleSubmit}>
           
                <div>
                    <label>Pickup Location:</label>
                    <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Drop-off Location:</label>
                    <input
                        type="text"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Available Seats:</label>
                    <input
                        type="number"
                        min="1"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Ride</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default RideCreate;
