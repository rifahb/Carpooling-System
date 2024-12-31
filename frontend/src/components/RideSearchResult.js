import React from 'react';
import { useLocation } from 'react-router-dom';

const RideSearchResult = () => {
    const location = useLocation();

    // Get ride details and driver details passed via navigation
    const { rideDetails, driverDetails } = location.state || {};

    // Check if the necessary details exist
    if (!rideDetails || !driverDetails) {
        return <p>No ride details found.</p>;
    }

    // Format the ride time (optional)
    const formattedRideTime = new Date(rideDetails.rideTime).toLocaleString();

    return (
        <div className="ride-search-result">
            <h1>Ride Booking Successful!</h1>

            <div className="ride-details">
                <h2>Ride Details</h2>
                <p><strong>Pickup Location:</strong> {rideDetails.pickupLocation}</p>
                <p><strong>Drop Location:</strong> {rideDetails.dropLocation}</p>
                <p><strong>Ride Time:</strong> {formattedRideTime}</p>
                <p><strong>Available Seats:</strong> {rideDetails.availableSeats}</p>
                <p><strong>Price:</strong> ${rideDetails.price}</p>
            </div>

            <div className="driver-details">
                <h2>Driver Details</h2>
                <p><strong>Car:</strong> {driverDetails.car}</p>
                <p><strong>Car Number:</strong> {driverDetails.carNumber}</p>
                <p><strong>Phone:</strong> {driverDetails.phone}</p>
            </div>
        </div>
    );
};

export default RideSearchResult;
