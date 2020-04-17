const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');
const Course = require('../models/courses');
const Bootcamp = require('../models/bootcamp');



//@desc     get courses 
//@route    GET /api/v1/courses
//@route    GET /api/v1/bootcamp/:bootcampId/courses
//@access   public
exports.getCourses = asyncHandler.handleAsync(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name, description'
        });
    }
    const courses = await query;
    res.status(200).json({
        success: true,
        count: courses.length,
        courses: courses
    });
});

//get single course
exports.getSingle = asyncHandler.handleAsync(async (req, res, next) => {
    const singleCourse = await Course.find({
        _id: req.params.id
    }).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!singleCourse) {
        res.status(404).json({
            success: true,
            msg: `Bootcamp with the ID of ${req.params.id} does not exits or have been deleted`,
            bootcamp: {}
        });
    } else {
        res.status(200).json({
            success: true,
            bootcamp: singleCourse
        });
    }
});

//add a course
exports.addCourse = asyncHandler.handleAsync(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        res.status(404).json({
            success: true,
            msg: `Bootcamp with the ID of ${req.params.bootcampId} does not exist or have been deleted`
        });
    }else{

        const course = await Course.create(req.body);
        res.status(200).json({
            success: true,
            course: course
        })
    }
});

//update course
exports.updateCourse = asyncHandler.handleAsync(async (req, res, next) => {
    const updateCourse = await Course.findByIdAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true,
        runValidators: true
    }).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (updateCourse) {
        res.status(200).json({
            success: true,
            course: updateCourse
        })
    } else {
        res.status(404).json({
            success: true,
            msg: `Course with the ID of ${req.params.id} does not exist or have bee deleted`,
            course: {}
        })
    }
});

//delete courses
exports.delCourse = asyncHandler.handleAsync(async (req, res, next) => {
    const delCourse = await Course.findById({_id: req.params.id});
    if(!delCourse){
        res.status(404).json({
            success: true,
            msg: `Course with the ID of ${req.params.id} does not exist or have been deleted`,
        });
    }
    await Course.remove({_id: req.params.id});
    res.status(200).json({
        success: true,
        msg: `Course with the ID of ${req.params.id} deleted successfully`,
        course: {}
    });
   
});