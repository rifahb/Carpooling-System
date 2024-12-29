const jwt = require('jsonwebtoken');
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
;
