const express = require('express');
const { createRide, matchRides, calculateDistance, bookRide,deleteExpiredRides } = require('../controllers/rideController');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

// POST route to create a new ride (for drivers to post a ride)
router.post('/create', verifyToken, createRide);  // Ensure the user is authenticated

// POST route to search for matching rides based on pickup and drop-off locations
router.post('/search', matchRides); // Users can search for nearby rides based on pickup and drop-off locations

// POST route to calculate the distance between two locations
router.post('/calculate-distance', calculateDistance); // Calculate distance using latitude and longitude
// In your routes (e.g., rideRoutes.js)
router.delete('/deleteExpiredRides', deleteExpiredRides);
router.post('/book-ride', bookRide); 
module.exports = router