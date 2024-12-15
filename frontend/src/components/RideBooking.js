import React, { useState } from 'react';
import axios from 'axios';

const RideBooking = ({ rideId }) => {
    const [bookingSuccess, setBookingSuccess] = useState(false);
    
    const handleBooking = async () => {
        try {
            const token = localStorage.getItem('token');  // Assuming you store the token in local storage
            const response = await axios.post(
                'http://localhost:5000/api/rides/book', 
                { rideId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookingSuccess(true);
        } catch (error) {
            console.error('Booking failed:', error);
        }
    };

    return (
        <div>
            <button onClick={handleBooking}>Book Ride</button>
            {bookingSuccess && <p>Ride booked successfully!</p>}
        </div>
    );
};

export default RideBooking;
