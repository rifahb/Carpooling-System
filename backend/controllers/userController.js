
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Import the MySQL connection pool

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const query = `INSERT INTO Users (name, email, password) VALUES (?, ?, ?)`;
        pool.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database for the user by email
        const query = `SELECT * FROM Users WHERE email = ?`;
        pool.query(query, [email], async (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Check if user exists
            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = rows[0]; // Extract the user data from the query result

            // Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.id,email:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token,driverId:user.id });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("Token received:", token);
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Split "Bearer <token>"
        req.user = verified;
        next();
    } catch (err) {
        console.error("Error verifying token:", err.message);
        res.status(400).json({ message: 'Invalid token' });
    }
};

/*exports.setUserDetails = async (req, res) => {
    try {
        console.log("Req.user in setUserDetails:", req.user);

        // Use 'email' from the token payload (assuming it's stored there)
        const email = req.user?.email; // Ensure that email is part of the token
        if (!email) {
            return res.status(403).json({ message: 'Unauthorized: email is missing in token.' });
        }

        const { phoneNumber, car, carNumber } = req.body;

        // Validate required fields
        if (!phoneNumber || !car || !carNumber) {
            return res.status(400).json({ message: 'All fields (phoneNumber, car, carNumber) are required.' });
        }

        // Database operations
        const [rows] = await db.execute('SELECT * FROM userdetails WHERE email = ?', [email]);

        if (rows.length > 0) {
            // Update existing user details
            await db.execute(
                'UPDATE userdetails SET phoneNumber = ?, car = ?, carNumber = ? WHERE email = ?',
                [phoneNumber, car, carNumber, email]
            );
            return res.json({ message: 'User details updated successfully.' });
        } else {
            // Insert new user details
            await db.execute(
                'INSERT INTO userdetails (email, phoneNumber, car, carNumber) VALUES (?, ?, ?, ?)',
                [email, phoneNumber, car, carNumber]
            );
            return res.json({ message: 'User details added successfully.' });
        }
    } catch (error) {
        console.error("Error in setUserDetails:", error);
        return res.status(500).json({ message: 'Error saving user details', error: error.message });
    }
};*/
// controllers/userController.js

//const db = require('../db'); // Make sure your db connection is correct

const db = require('../db'); // Make sure this path matches your database config file

// Controller to handle setting/updating user details
exports.setUserDetails = async (req, res) => {
    try {
        console.log("Received request:", req.body);
        console.log("Req.user:", req.user);

        if (!req.user || !req.user.id) {
            console.log("Unauthorized: Token missing id");
            return res.status(403).json({ message: 'Unauthorized: id is missing in token.' });
        }

        const userId = req.user.id;
        const { phoneNumber, car, carNumber } = req.body;

        console.log("Payload:", { userId,phoneNumber, car, carNumber });

        // Validate input
        if (!phoneNumber || !car || !carNumber) {
            console.log("Validation failed: Missing fields");
            return res.status(400).json({ message: 'All fields (phoneNumber, car, carNumber) are required.' });
        }

        // Database query
        console.log("Executing SELECT query...");
       
            db.query('SELECT * FROM userdetails WHERE id = ?', [userId], (err, rows) => {
                if (err) {
                    console.error("Error fetching user details:", err);
                    return res.status(500).json({ message: 'Error fetching user details', error: err.message });
                }
    
                console.log("Query Result:", rows);
    
                if (rows.length > 0) {
                    // User details already exist, so update them
                    db.query(
                        'UPDATE userdetails SET phoneNumber = ?, car = ?, carNumber = ? WHERE id = ?',
                        [phoneNumber, car, carNumber, userId],
                        (updateErr) => {
                            if (updateErr) {
                                console.error("Error updating user details:", updateErr);
                                return res.status(500).json({ message: 'Error updating user details', error: updateErr.message });
                            }
                            return res.json({ message: 'User details updated successfully.' });
                        }
                    );
                } else {
                    // Insert new user details since they don't exist yet
                    db.query(
                        'INSERT INTO userdetails (id, phoneNumber, car, carNumber) VALUES (?, ?, ?, ?)',
                        [userId, phoneNumber, car, carNumber],
                        (insertErr) => {
                            if (insertErr) {
                                console.error("Error inserting user details:", insertErr);
                                return res.status(500).json({ message: 'Error inserting user details', error: insertErr.message });
                            }
                            return res.json({ message: 'User details added successfully.' });
                        }
                    );
                }
            });  
    } catch (error) {
        console.error("Error in setUserDetails:", error.message);
        return res.status(500).json({ message: 'Error saving user details', error: error.message });
    }
};
