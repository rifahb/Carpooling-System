const express = require('express');
const { createRide, matchRides, calculateDistance, bookRide } = require('../controllers/rideController');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

// POST route to create a new ride (for drivers to post a ride)
router.post('/create', verifyToken, createRide);  // Ensure the user is authenticated

// POST route to search for matching rides based on pickup and drop-off locations
router.post('/search', matchRides); // Users can search for nearby rides based on pickup and drop-off locations

// POST route to calculate the distance between two locations
router.post('/calculate-distance', calculateDistance); // Calculate distance using latitude and longitude

// POST route to book a ride (ensure the user is authenticated)
router.post('/book-ride', bookRide);  // Apply the verifyToken middleware to ensure the user is logged in

module.exports = router;  // Export the router to use it in index.js
