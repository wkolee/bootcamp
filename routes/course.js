const express = require('express');
const router = express.Router({mergeParams:true});
const {protectRoute, authorize} = require('../middleware/auth');


const {
    getCourses,
    getSingle,
    addCourse,
    updateCourse,
    delCourse,
} = require('../controllers/courses');
const Course = require('../models/courses');
const advanceResults = require('../middleware/advanceResult');


//get all courses
router.get('/', advanceResults(Course, {
    path:'bootcamp',
    select: 'name description'
}), getCourses);

//get single course
router.get('/:id', getSingle);
//update course
router.put('/:id',protectRoute, authorize('publisher', 'admin'), updateCourse);
//delete a course 
router.delete('/:id',protectRoute,authorize('publisher', 'admin'), delCourse);

//add a course
router.post('/', protectRoute, authorize('publisher', 'admin'), addCourse);

module.exports = router;