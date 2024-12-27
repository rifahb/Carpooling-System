const db = require('../db'); // Make sure this path matches your database config file

// Controller to handle setting/updating user details
const setUserDetails = async (req, res) => {
    try {
        console.log("Req.user in setUserDetails:", req.user);

        // Use 'id' or 'driverId' based on your token payload and schema
        const userId = req.user?.id; // Adjust if your token uses 'driverId'
        if (!userId) {
            return res.status(403).json({ message: 'Unauthorized: id is missing in token.' });
        }

        const { phoneNumber, car, carNumber } = req.body;

        // Validate required fields
        if (!phoneNumber || !car || !carNumber) {
            return res.status(400).json({ message: 'All fields (phoneNumber, car, carNumber) are required.' });
        }

        // Database operations
        const [rows] = await db.execute('SELECT * FROM userdetails WHERE id = ?', [userId]);

        if (rows.length > 0) {
            // Update existing user details
            await db.execute(
                'UPDATE userdetails SET phoneNumber = ?, car = ?, carNumber = ? WHERE id = ?',
                [phoneNumber, car, carNumber, userId]
            );
            return res.json({ message: 'User details updated successfully.' });
        } else {
            // Insert new user details
            await db.execute(
                'INSERT INTO userdetails (id, phoneNumber, car, carNumber) VALUES (?, ?, ?, ?)',
                [userId, phoneNumber, car, carNumber]
            );
            return res.json({ message: 'User details added successfully.' });
        }
    } catch (error) {
        console.error("Error in setUserDetails:", error);
        return res.status(500).json({ message: 'Error saving user details', error: error.message });
    }
};

module.exports = { setUserDetails };
