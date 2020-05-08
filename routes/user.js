const router = require('express').Router();
const userUpdate = require('../controllers/user');
const User = require('../models/user');
const {protectRoute, authorize} = require('../middleware/auth');


//register users

//get login user
router.get('/profile',protectRoute, userUpdate.currentUser);
//update profile
router.put('/update', protectRoute, userUpdate.user);
router.put('/updatepassword', protectRoute, userUpdate.userpassword);


//admin route
router.get('/admin/alluser',protectRoute, authorize("admin"), userUpdate.adminUsers);
//update user email
router.put('/admin/updates/:userID',protectRoute, authorize("admin"), userUpdate.adminUpdate);
//update user password 
router.put('/admin/updatepassword/:userID',protectRoute, authorize("admin"), userUpdate.adminPassword);
//deleted user
router.delete('/admin/delete/:userID',protectRoute, authorize("admin"), userUpdate.adminDelete);


module.exports = router;