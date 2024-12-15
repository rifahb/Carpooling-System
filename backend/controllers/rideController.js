// controllers/rideController.js
const axios = require('axios');
const { validateLocation } = require('./locationValidator'); 
// Import your models if needed (e.g., for creating a ride in the database)
const { Ride } = require('../../models');
const pool = require('../db'); // Import the DB connection
// Function to create a new ride
/*exports.createRide = async (req, res) => {
    const { driverId, pickupLocation, dropOffLocation, availableSeats } = req.body;

    try {
        const ride = await Ride.create({
            driverId,
            pickupLocation,
            dropOffLocation,
            availableSeats,
        });

        res.status(201).json({ message: 'Ride created successfully', ride });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/
/*exports.createRide = async (req, res) => {
    const { driverId, pickupLocation, dropOffLocation, availableSeats } = req.body;

    try {
        const query = `
            INSERT INTO Rides (driver_Id, pickup_location, drop_location, available_seats)
            VALUES (?, ?, ?, ?)
        `;
        pool.query(query, [driverId, pickupLocation, dropOffLocation, availableSeats], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Ride created successfully', rideId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/
exports.createRide = async (req, res) => {
    const { driverId, pickupLocation, dropOffLocation, availableSeats } = req.body;

    try {
        // Validate locations
        const pickupValidation = await validateLocation(pickupLocation);
        const dropOffValidation = await validateLocation(dropOffLocation);

        if (!pickupValidation.isValid || !dropOffValidation.isValid) {
            return res.status(400).json({ error: 'Invalid pickup or drop-off location.' });
        }

        // Ensure driverId exists
        const driverQuery = `SELECT * FROM Users WHERE id = ?`;
        const [driver] = await pool.promise().query(driverQuery, [driverId]);

        if (driver.length === 0) {
            return res.status(404).json({ error: 'Driver not found.' });
        }

        // Insert the ride into the database
        const query = `
            INSERT INTO Rides (driver_Id, pickup_location, drop_location, available_seats)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.promise().query(query, [driverId, pickupLocation, dropOffLocation, availableSeats]);

        res.status(201).json({ message: 'Ride created successfully', rideId: result.insertId });
    } catch (err) {
        console.error('Error creating ride:', err);
        res.status(500).json({ error: err.message });
    }
};
/*
// Function to search for matching rides
exports.matchRides = async (req, res) => {
    const { pickup, dropoff } = req.body;

    try {
        // Replace this with your actual ride matching logic
        const matchingRides = await Ride.findAll({ where: { pickup_location: pickup, drop_location: dropoff } });

        res.status(200).json({ matchingRides });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/
exports.matchRides = async (req, res) => {
    const { pickup, dropoff } = req.body;

    try {
        const query = `
            SELECT * FROM Rides
            WHERE pickup_location = ? AND drop_location = ?
        `;
        pool.query(query, [pickup, dropoff], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
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

/*
// Function to book a ride
exports.bookRide = async (req, res) => {
    const { rideId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated via JWT

    try {
        // Replace with actual logic for booking a ride
        // For example, update ride availability or book the ride
        const ride = await Ride.update({ availableSeats: 0 }, { where: { id: rideId } });

        res.status(200).json({ message: 'Ride booked successfully', ride });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};*/
exports.bookRide = async (req, res) => {
    const { rideId } = req.body;
    const userId = req.user.id; // Assuming the user is authenticated

    try {
        // Update ride's available seats after booking
        const query = `
            UPDATE Rides
            SET available_seats = available_seats - 1
            WHERE id = ? AND available_seats > 0
        `;
        pool.query(query, [rideId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Ride is fully booked or does not exist.' });
            }

            res.status(200).json({ message: 'Ride booked successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

