const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];  // This extracts the token after "Bearer"

    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = decoded;  // Attach decoded user information to request
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};
