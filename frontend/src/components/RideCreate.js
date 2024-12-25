import React, { useState } from 'react';
import axios from 'axios';



const RideCreate = () => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [availableSeats, setAvailableSeats] = useState('');
    const [rideTime, setRideTime] = useState(''); // New state for ride time

    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const localDate = new Date(rideTime); // This gets the input as local time
        const offset = 5.5 * 60 * 60 * 1000; // IST is UTC + 5:30 hours
        const istDate = new Date(localDate.getTime() + offset); // Add IST offset
        const istISOString = istDate.toISOString(); // Convert to ISO string
        const driverId = localStorage.getItem('driverId');
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to create a ride.');
            return;
        }
        console.log('Submitted Data:', { token,driverId,pickupLocation, dropOffLocation, availableSeats,rideTime });
        console.log('Request URL:', 'http://localhost:5000/api/rides/search');
        console.log('Request Headers:', { Authorization: `Bearer ${token}` });
       // console.log('Request Body:', { pickup, dropoff, rideTime: istISOString });
        if (!driverId) {
        setMessage('Driver ID not found.');
        return;
    }
        try {
            console.log('Submitted Data:', { pickupLocation, dropOffLocation, availableSeats });
            const formattedRideTime = rideTime.replace('T', ' ').split('.')[0]; // Convert to 'YYYY-MM-DD HH:MM:SS'

            const response = await axios.post(
                'http://localhost:5000/api/rides/create',
                {
                    driverId, // Replace with dynamic driver ID if available
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
                <div>
                    <label>Ride Time:</label> {/* New input for ride time */}
                    <input
                        type="datetime-local" // This creates a date-time picker
                        value={rideTime}
                        onChange={(e) => setRideTime(e.target.value)}
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
