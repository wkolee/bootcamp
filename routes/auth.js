const express = require('express');
const router = express.Router();
const {protectRoute} = require('../middleware/auth');

const {userRegister, userLogin, forgotPassword, resetPassword, logout} = require('../controllers/auth');
//register users
router.post('/register', userRegister);

//login users
router.post('/login', userLogin);
//reset password
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);
router.get('/logout',protectRoute, logout);


module.exports = router;