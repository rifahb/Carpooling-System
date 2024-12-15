// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { User } = require('../../models');

// exports.register = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ name, email, password: hashedPassword });
//         res.status(201).json({ message: 'User registered successfully', user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         console.log('Token:', token);
// console.log('Decoded:', decoded);

//         const user = await User.findOne({ where: { email } });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
//         console.log(process.env.JWT_SECRET);
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ message: 'Login successful', token });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(403).json({ message: 'Access denied' });

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(400).json({ message: 'Invalid token' });
//     }
// };

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
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({ message: 'Login successful', token,driverId:user.id });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
