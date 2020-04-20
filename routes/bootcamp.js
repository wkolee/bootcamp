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
    picture
} = require('../controllers/bootcamp');
const Bootcamp = require('../models/bootcamp');
const advanceResults = require('../middleware/advanceResult');



//include other resource routes
const CourseRoute = require('../routes/course');


//re-route
router.use('/:bootcampId/courses', CourseRoute);


//get all bootcamp
router.get('/', advanceResults(Bootcamp, 'courses'), getBootcamps);

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

//picture route
router.put('/:id/photo', picture);

module.exports = router;