import React from 'react';
import { useLocation } from 'react-router-dom';
import './RideSearchResult.css'
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

    // Convert price from USD to INR
    const convertedPrice = (rideDetails.price * 83).toFixed(2);

    return (
        <div className="ride-search-result">
            <h1>Ride Booking Successful!</h1>

            <table className="result-table">
                <thead>
                    <tr>
                        <th>Detail</th>
                        <th>Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pickup Location</td>
                        <td>{rideDetails.pickupLocation}</td>
                    </tr>
                    <tr>
                        <td>Drop Location</td>
                        <td>{rideDetails.dropLocation}</td>
                    </tr>
                    <tr>
                        <td>Ride Time</td>
                        <td>{formattedRideTime}</td>
                    </tr>
                    <tr>
                        <td>Available Seats</td>
                        <td>{rideDetails.availableSeats}</td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td>₹{convertedPrice}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Driver Details</h2>
            <table className="result-table">
                <thead>
                    <tr>
                        <th>Detail</th>
                        <th>Information</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Car</td>
                        <td>{driverDetails.car}</td>
                    </tr>
                    <tr>
                        <td>Car Number</td>
                        <td>{driverDetails.carNumber}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{driverDetails.phone}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default RideSearchResult;
