const express = require('express');
const router = express.Router({mergeParams:true});


const {
    getCourses,
    getSingle,
    addCourse,
    updateCourse,
    delCourse,
} = require('../controllers/courses');


//get all courses
router.get('/', getCourses);

//get single course
router.get('/:id', getSingle);
//update course
router.put('/:id', updateCourse);
//delete a course 
router.delete('/:id', delCourse);

//add a course
router.post('/', addCourse);

module.exports = router;