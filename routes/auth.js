const express = require('express');
const router = express.Router();
const {protectRoute} = require('../middleware/auth');

const {userRegister, userLogin, currentUser} = require('../controllers/auth');
//register users
router.post('/register', userRegister);

//login users
router.post('/login', userLogin);

//get login user
router.get('/profile',protectRoute, currentUser);

module.exports = router;