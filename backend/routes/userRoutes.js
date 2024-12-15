const express = require('express');
const { register, login,verifyToken } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', verifyToken, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
