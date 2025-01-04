import React, { useState } from 'react';
import axios from 'axios';
import './RideCreate.css'; // Import the CSS

const RideCreate = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [availableSeats, setAvailableSeats] = useState('');
    const [rideTime, setRideTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const localDate = new Date(rideTime);
        const offset = 5.5 * 60 * 60 * 1000; // IST offset
        const istDate = new Date(localDate.getTime() + offset);
        const istISOString = istDate.toISOString();
        const driverId = localStorage.getItem('driverId');
        const token = localStorage.getItem('token');
        
        if (!token) {
            setMessage('You must be logged in to create a ride.');
            return;
        }
        if (!driverId) {
            setMessage('Driver ID not found.');
            return;
        }

        try {
            const formattedRideTime = rideTime.replace('T', ' ').split('.')[0];
            const response = await axios.post(
                'http://localhost:5000/api/rides/create',
                {
                    driverId,
                    pickupLocation,
                    dropOffLocation,
                    availableSeats,
                    rideTime: formattedRideTime,
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
            setRideTime('');
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
        <div className="ride-create-container">
            <h3>Create a New Ride</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Pickup Location:</label>
                    <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Drop-off Location:</label>
                    <input
                        type="text"
                        value={dropOffLocation}
                        onChange={(e) => setDropOffLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Available Seats:</label>
                    <input
                        type="number"
                        min="1"
                        value={availableSeats}
                        onChange={(e) => setAvailableSeats(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Ride Time:</label>
                    <input
                        type="datetime-local"
                        value={rideTime}
                        onChange={(e) => setRideTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Ride</button>
            </form>
            {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
        </div>
    );
};

export default RideCreate;
