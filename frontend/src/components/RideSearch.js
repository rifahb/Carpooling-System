import React, { useState } from 'react';
import axios from 'axios';

const RideSearch = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [matchingRides, setMatchingRides] = useState([]);
    const [rideTime, setRideTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        // Convert the selected ride time to UTC format
        const localDate = new Date(rideTime); // Interpret the input as local time
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Convert to UTC
        const formattedRideTime = utcDate.toISOString().slice(0, 19).replace('T', ' '); // Converts to ISO format (UTC)

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to search for rides.');
            return;
        }

        console.log('Request URL:', 'http://localhost:5000/api/rides/search');
        console.log('Request Headers:', { Authorization: `Bearer ${token}` });
        console.log('Request Body:', { pickup, dropoff, rideTime: formattedRideTime }); // Sending UTC time

        try {
            const response = await axios.post(
                'http://localhost:5000/api/rides/search',
                { pickup, dropoff, rideTime: formattedRideTime },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Response:', response.data);
            setMatchingRides(response.data.matchingRides);
            if (response.data.matchingRides.length === 0) {
                setMessage('No rides found for the given locations.');
            } else {
                setMessage('');
            }
        } catch (error) {
            console.error('Error fetching rides:', error);
            setMessage('Unable to fetch rides. Please try again later.');
        }
    };

    return (
        <div>
            <h3>Search for Rides</h3>
            <form onSubmit={handleSearch}>
                <div>
                    <label>Pickup Location:</label>
                    <input
                        type="text"
                        placeholder="Pickup Location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Drop-off Location:</label>
                    <input
                        type="text"
                        placeholder="Drop-off Location"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Ride Time(24hr format):</label>
                    <input
                        type="datetime-local"
                        value={rideTime}
                        onChange={(e) => setRideTime(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Search</button>
            </form>

            <h4>Matching Rides</h4>
            {message && <p>{message}</p>}
            <ul>
    {matchingRides.map((ride, index) => {
        // Convert UTC time to local time
        const localRideTime = new Date(ride.ride_time).toLocaleString(); // This converts UTC to local time

        return (
            <li key={index}>
                Pickup: {ride.pickup_location}, Drop-off: {ride.drop_location}, Available Seats: {ride.available_seats}, Time: {localRideTime}
            </li>
        );
    })}
</ul>   
        </div>
    );
};

export default RideSearch;
