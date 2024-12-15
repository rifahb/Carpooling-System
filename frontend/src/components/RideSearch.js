import React, { useState } from 'react';
import axios from 'axios';

const RideSearch = () => {
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [matchingRides, setMatchingRides] = useState([]);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to search for rides.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/rides/search',
                { pickup, dropoff },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
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
                <button type="submit">Search</button>
            </form>

            <h4>Matching Rides</h4>
            {message && <p>{message}</p>}
            <ul>
                {matchingRides.map((ride, index) => (
                    <li key={index}>
                        Pickup: {ride.pickup_location}, Drop-off: {ride.drop_location}, Available Seats: {ride.available_seats}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RideSearch;
