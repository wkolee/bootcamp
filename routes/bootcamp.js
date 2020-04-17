const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { 
    getBootcamps, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcamp,
    getRadius,
} = require('../controllers/bootcamp');



//include other resource routes
const CourseRoute = require('../routes/course');


//re-route
router.use('/:bootcampId/courses', CourseRoute);


//get all bootcamp
router.get('/', getBootcamps);

//get a single bootcamp
router.get('/:id', getBootcamp);

//post to bootcamp
router.post('/', createBootcamp);

//update
router.put('/:id', updateBootcamp);

//delete
router.delete('/:id', deleteBootcamp);


//post route for picture
//router.post('/photo', upload.single('pic'),  postPic);


//get radius
router.get('/radius/:zipCode/:miles', getRadius);



module.exports = router;