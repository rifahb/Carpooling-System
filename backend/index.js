/*const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const mapRoutes = require('./routes/mapRoutes'); // Geocoding
const rideRoutes = require('./routes/rideRoutes'); // Ride creation and matching

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/maps', mapRoutes); // Geocoding route
app.use('/api/rides', rideRoutes); // Ride creation and matching route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
require('dotenv').config();
console.log(process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();


app.use(cors());
app.use(express.json());
const rideRoutes = require('./routes/rideRoutes');  // Import the route for calculating distance
const userRoutes = require('./routes/userRoutes'); 
// Use the route for all routes that start with /api/rides
// Import the routes
const mapRoutes = require('./routes/mapRoutes'); 
app.use('/api/rides', rideRoutes);
 // Import the map routes
app.use('/api/maps', mapRoutes);  // Use the route for geocoding
app.use('/api/users', userRoutes);
//app.use('/calculateDistance',routedistance);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
