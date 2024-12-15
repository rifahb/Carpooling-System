const express = require('express');
const { getCoordinates } = require('../controllers/mapController');
const router = express.Router();

// POST route for geocoding address
router.post('/geocode', getCoordinates);

module.exports = router;
