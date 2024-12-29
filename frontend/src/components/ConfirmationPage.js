import React from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
    const { state } = useLocation();
    const { rideDetails, driverDetails } = state;

    return (
        <div>
            <h3>Your Ride is Booked!</h3>
            <h4>Ride Details</h4>
            <p>Destination: {rideDetails.destination}</p>
            <p>Available Seats: {rideDetails.availableSeats}</p>
            <p>Price: {rideDetails.price}</p>

            <h4>Driver Details</h4>
            <p>Name: {driverDetails.name}</p>
            <p>Car: {driverDetails.car}</p>
            <p>Car Number: {driverDetails.carNumber}</p>
        </div>
    );
};

export default ConfirmationPage;
