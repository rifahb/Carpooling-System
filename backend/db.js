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
    SELECT 
        Rides.id AS rideId, 
        Rides.driver_id, 
        Rides.pickup_location, 
        Rides.drop_location, 
        Rides.available_seats, 
        userdetails.phoneNumber AS phoneNo
    FROM 
        Rides
    JOIN 
        userdetails 
    ON 
        Rides.driver_id = userdetails.id
    WHERE 
        Rides.available_seats > 0;
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
CREATE TRIGGER CheckAvailableSeats
BEFORE UPDATE ON rides
FOR EACH ROW
BEGIN
    IF NEW.Available_seats < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Available seats cannot be negative.';
    END IF;
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
