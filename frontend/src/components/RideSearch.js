
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RideSearch = () => {
    const navigate = useNavigate();

    // State variables to hold search results, messages, and user input
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [rideTime, setRideTime] = useState('');
    const [matchingRides, setMatchingRides] = useState([]);
    const [message, setMessage] = useState('');

    // Book ride function
    const handleBookRide = async (rideId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to book a ride.');
            return;
        }

        const userId = localStorage.getItem('driverId');
        if (!userId) {
            alert('User ID is required.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/rides/book-ride',
                { rideId, userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Booking successful:', response.data);

            navigate('/ride-search-result', {
                state: {
                    rideDetails: response.data.rideDetails,
                    driverDetails: response.data.driverDetails,
                },
            });
        } catch (error) {
            console.error('Error booking ride:', error);
            alert('Error booking ride. Please try again later.');
        }
    };

    // Search rides function
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
        console.log('Request Body:', { pickup, dropoff, rideTime: formattedRideTime });

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
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Pickup Location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Dropoff Location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={rideTime}
                    onChange={(e) => setRideTime(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {message && <p>{message}</p>}

            <ul>
                {matchingRides.map((ride, index) => {
                    const localRideTime = new Date(ride.ride_time).toLocaleString(); // Convert UTC to local time
                    return (
                        <li key={ride.id}>
                            Pickup: {ride.pickup_location}, Drop-off: {ride.drop_location},
                            Available Seats: {ride.available_seats}, Time: {localRideTime}, Price: {ride.price}
                            <button onClick={() => handleBookRide(ride.id)}>Book Ride</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RideSearch;
