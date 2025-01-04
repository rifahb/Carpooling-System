const express = require('express');
const { getUserDetails,register, login,verifyToken,setUserDetails } = require('../controllers/userController');
//const { setUserDetails } = require('../controllers/userDetailsController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/set-user-details', verifyToken,setUserDetails);
router.get('/:id', getUserDetails);
router.get('/protected', verifyToken, (req, res) => {
    res.send('This is a protected route');
});
//router.post('/set-user-details', setUserDetails);

module.exports = router;
