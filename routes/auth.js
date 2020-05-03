const express = require('express');
const router = express.Router();
const {protectRoute} = require('../middleware/auth');

const {userRegister, userLogin, currentUser, forgotPassword, resetPassword} = require('../controllers/auth');
//register users
router.post('/register', userRegister);

//login users
router.post('/login', userLogin);
//reset password
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

//get login user
router.get('/profile',protectRoute, currentUser);

module.exports = router;