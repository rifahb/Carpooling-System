import React from 'react';
import { useLocation } from 'react-router-dom';

const RideSearchResult = () => {
    const location = useLocation();
    const { matchingRides } = location.state || {};  // Destructure matchingRides from state

    if (!matchingRides) {
        return <p>No rides available.</p>;
    }

    const rideId = location.state?.rideId;
    const selectedRide = matchingRides.find((ride) => ride.id === rideId);

    return (
        <div>
            <h2>Ride Details</h2>
            {selectedRide ? (
                <div>
                    <p>
                        <strong>Pickup:</strong> {selectedRide.pickup_location} <br />
                        <strong>Drop-off:</strong> {selectedRide.drop_location} <br />
                        <strong>Available Seats:</strong> {selectedRide.available_seats} <br />
                        <strong>Time:</strong> {new Date(selectedRide.ride_time).toLocaleString()} <br />
                        <strong>Price:</strong> ${selectedRide.price}
                    </p>
                </div>
            ) : (
                <p>Ride not found.</p>
            )}
        </div>
    );
};

export default RideSearchResult;
