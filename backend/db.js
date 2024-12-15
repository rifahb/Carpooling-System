const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',  // Update with your host if it's not localhost
  user: 'root',       // Your MySQL username
  password: 'rifah#3124', // Your MySQL password
  database: 'carpool', // Your database name
});

// SQL query to create the view
const createViewQuery = `
    CREATE VIEW ActiveRides AS
    SELECT Rides.id AS rideId, Rides.driver_id, Rides.pickup_location, Rides.drop_location, Rides.available_seats
    FROM Rides
    WHERE Rides.available_seats > 0;
`;

// Execute the query
pool.query(createViewQuery, (err, results) => {
    if (err) {
        console.error('Error creating view:', err.message);
    } else {
        console.log('View created successfully');
    }
});
// SQL query to create the trigger
const createTriggerQuery = `
    CREATE TRIGGER UpdateRideSeats
    AFTER INSERT ON Bookings
    FOR EACH ROW
    BEGIN
        UPDATE Rides
        SET available_seats = available_seats - 1
        WHERE id = NEW.rideId;
    END;
`;

// Execute the query to create the trigger
pool.query(createTriggerQuery, (err, results) => {
    if (err) {
        console.error('Error creating trigger:', err.message);
    } else {
        console.log('Trigger created successfully');
    }
});

// Export the connection pool for use in queries
module.exports = pool;
