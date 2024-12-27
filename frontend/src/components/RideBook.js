import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RideBook = () => {
    const { rideId } = useParams();  // Get the rideId from the URL params
    const [ride, setRide] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch the ride details using the rideId
        const fetchRideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rides/${rideId}`);
                setRide(response.data);
            } catch (error) {
                setMessage('Error fetching ride details.');
            }
        };

        fetchRideDetails();
    }, [rideId]);

    const handleConfirmBooking = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to book a ride.');
            return;
        }

        try {
            // Assuming we have an API endpoint to confirm bookings
            const response = await axios.post(
                'http://localhost:5000/api/rides/book',
                { rideId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Booking confirmed!');
        } catch (error) {
            setMessage('Error confirming booking.');
        }
    };

    return (
        <div>
            <h3>Book Ride</h3>
            {ride ? (
                <div>
                    <p>Pickup Location: {ride.pickup_location}</p>
                    <p>Drop-off Location: {ride.drop_location}</p>
                    <p>Available Seats: {ride.available_seats}</p>
                    <p>Ride Time: {new Date(ride.ride_time).toLocaleString()}</p>
                    <button onClick={handleConfirmBooking}>Confirm Booking</button>
                </div>
            ) : (
                <p>{message || 'Loading ride details...'}</p>
            )}
        </div>
    );
};

export default RideBook;
