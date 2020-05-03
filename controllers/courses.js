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
        const courses = Course.find({bootcamp: req.params.bootcampId});
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advanceResults);
    }
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
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        return next(new ErrorResponse('bootcamp does not exist', 404));
    }
    //course exist, check if current user own bootcamp before deleting
    if(bootcamp.user.toString() != req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`${req.user.name} does not own this bootcamp`, 401));
    }

        const course = await Course.create(req.body);
        res.status(200).json({
            success: true,
            course: course
        })
    }
);

//update course
exports.updateCourse = asyncHandler.handleAsync(async (req, res, next) => {
    let updateCourse = await Course.findById(req.params.id);

    if (!updateCourse) {
        return next(new ErrorResponse('course does not exist', 404));
    } 
    //course exist, check if current user own bootcamp before deleting
    if(updateCourse.user.toString() != req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`${req.user.name} does not own this course`, 401));
    }

    updateCourse = await Course.findOneAndUpdate({
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

        res.status(200).json({
            success: true,
            course: updateCourse
        })
    
});

//delete courses
exports.delCourse = asyncHandler.handleAsync(async (req, res, next) => {
    let delCourse = await Course.findById({_id: req.params.id});
    if(!delCourse){
      return next(new ErrorResponse('course does not exist', 404));
    }
    if(delCourse.user.toString() != req.user.id && req.user.role != 'admin'){
        return next(new ErrorResponse(`${req.user.name} does not own this course`, 401));
    }

    delCourse = await Course.remove({_id: req.params.id});
    res.status(200).json({
        success: true,
        msg: `Course with the ID of ${req.params.id} deleted successfully`,
        course: {}
    });
   
});