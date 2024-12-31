// controllers/rideController.js
const axios = require('axios');
const { validateLocation } = require('./locationValidator'); 
// Import your models if needed (e.g., for creating a ride in the database)
const { Ride } = require('../../models');
const pool = require('../db'); // Import the DB connection

exports.createRide = async (req, res) => {
    const { driverId, pickupLocation, dropOffLocation, availableSeats, rideTime } = req.body;

    try {
        // Validate locations
        const pickupValidation = await validateLocation(pickupLocation);
        const dropOffValidation = await validateLocation(dropOffLocation);

        if (!pickupValidation.isValid || !dropOffValidation.isValid) {
            return res.status(400).json({ error: 'Invalid pickup or drop-off location.' });
        }


        const { lat: pickupLat, lon: pickupLon } = pickupValidation;
        const { lat: dropLat, lon: dropLon } = dropOffValidation;
        // Calculate distance and price
        const distanceRes = await axios.post('http://localhost:5000/api/rides/calculate-distance', {
            startLat: pickupLat,
            startLon: pickupLon,
            endLat: dropLat,
            endLon: dropLon,
        });
        const { distance } = distanceRes.data;
        const price = (distance / 1000) * 1;
        // Ensure driverId exists
        const driverQuery = `SELECT * FROM Users WHERE id = ?`;
        const [driver] = await pool.promise().query(driverQuery, [driverId]);

        if (driver.length === 0) {
            return res.status(404).json({ error: 'Driver not found.' });
        }
        const localDate = new Date(rideTime); // Interpret the input as local time
        const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Convert to UTC
        const formattedRideTime = utcDate.toISOString().slice(0, 19).replace('T', ' ');
        // Format ride_time to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
       // const formattedRideTime = new Date(rideTime).toISOString().slice(0, 19).replace('T', ' ');

        // Insert the ride into the database
        const query = `
            INSERT INTO Rides (driver_Id, pickup_location, drop_location, available_seats, ride_time,price)
            VALUES (?, ?, ?, ?, ?,?)
        `;
        const [result] = await pool.promise().query(query, [driverId, pickupLocation, dropOffLocation, availableSeats, formattedRideTime,price.toFixed(2)]);

        res.status(201).json({ message: 'Ride created successfully', rideId: result.insertId });
    } catch (err) {
        console.error('Error creating ride:', err);
        res.status(500).json({ error: err.message });
    }
};

// exports.matchRides = async (req, res) => {
//     const { pickup, dropoff, rideTime:formattedRideTime} = req.body;

//     try {
//         const query = `
//             SELECT * FROM Rides
//             WHERE pickup_location LIKE ? 
//               AND drop_location LIKE ? 
//               AND ride_time >= ?
//         `;
//         console.log('SQL Query:', query);
//         console.log('Query Params:', [`%${pickup}%`, `%${dropoff}%`, formattedRideTime]); // Log the parameters for debugging

//         // Use the rideTime directly from the frontend
//         pool.query(query, [`%${pickup}%`, `%${dropoff}%`, formattedRideTime], (err, rows) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             if (rows.length === 0) {
//                 return res.status(404).json({ message: 'No rides found for the given locations and time.' });
//             }
//             res.status(200).json({ matchingRides: rows });
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
exports.matchRides = async (req, res) => {
    const { pickup, dropoff, rideTime: formattedRideTime } = req.body;

    try {
        const query = `
            SELECT * FROM Rides
            WHERE pickup_location LIKE ? 
              AND drop_location LIKE ? 
              AND ride_time >= ?
        `;
        console.log('SQL Query:', query);
        console.log('Query Params:', [`%${pickup}%`, `%${dropoff}%`, formattedRideTime]);

        pool.query(query, [`%${pickup}%`, `%${dropoff}%`, formattedRideTime], async (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ message: 'No rides found for the given locations and time.' });
            }

            res.status(200).json({ matchingRides: rows });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Function to calculate the distance (this should already be defined in your controller)


exports.calculateDistance = async (req, res) => {
    const { startLat, startLon, endLat, endLon } = req.body;
    console.log('Start Coordinates:', { startLat, startLon });
    console.log('End Coordinates:', { endLat, endLon });

    const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false&geometries=polyline&steps=true`;

    try {
        const response = await axios.get(url);

        // Check if the response contains routes
        if (!response.data.routes || response.data.routes.length === 0) {
            return res.status(404).json({ error: 'No route found between the provided coordinates.' });
        }

        const distance = response.data.routes[0].legs[0].distance; // Distance in meters
        const duration = response.data.routes[0].legs[0].duration; // Duration in seconds

        res.json({ distance, duration });
    } catch (err) {
        res.status(500).json({ error: 'Error calculating distance and duration: ' + err.message });
    }
};
const db = require('../db'); // Database connection

exports.bookRide = async (req, res) => {
    const { rideId, userId } = req.body; // rideId from the ride details and userId from the logged-in user

    try {
        // Fetch the ride details
        const [rideResults] = await db.promise().query('SELECT * FROM rides WHERE id = ?', [rideId]);
        const ride = rideResults[0]; // Extract the first ride from the result set

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if seats are available
        if (ride.Available_seats <= 0) { // Match your DB column for available seats
            return res.status(400).json({ message: 'No available seats left' });
        }

        // Update availableSeats (decrement by 1)
        db.query('UPDATE rides SET Available_seats =Available_seats - 1 WHERE id = ?', [rideId], (err) => {
            if (err) {
                throw new Error('Error updating available seats');
            }
        });

        // Fetch driver details using the driverId
        const [driverResults] = await db.promise().query('SELECT * FROM userdetails WHERE id = ?', [ride.driver_id]); // Match driver_id column
        const driverDetails = driverResults[0]; // Extract the first driver from the result set

        if (!driverDetails) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Return the response with ride and driver details
        res.json({
            message: 'Ride booked successfully',
            rideDetails: {
                id: ride.id,
                pickupLocation: ride.pickup_location, // Adjust to match your DB column
                dropLocation: ride.drop_location, // Adjust to match your DB column
                rideTime: ride.ride_time, // Adjust to match your DB column
                availableSeats: ride.available_seats , // Reflect updated seats in the response
                price: ride.price, // Adjust to match your DB column
            },
            driverDetails: {
                id: driverDetails.id,
                // Adjust to match your DB column
                phone: driverDetails.phoneNumber, // Adjust to match your DB column
                car: driverDetails.car, // Adjust to match your DB column
                carNumber: driverDetails.carNumber, // Adjust to match your DB column
            },
        });
    } catch (error) {
        console.error('Error booking ride:', error);
        res.status(500).json({ message: 'Error booking ride', error: error.message });
    }
};
