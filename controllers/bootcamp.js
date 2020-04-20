const geoCode = require('../utils/geoCode');
const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');
const path = require('path');




//@desc     get all bootcamps 
//@route    GET /api/v1/bootcamp
//@access   public
exports.getBootcamps = asyncHandler.handleAsync( async (req, res, next)=>{
      res.status(200).json(res.advanceResults);  
});

//@desc    get a single bootcamp 
//@route   GET /api/v1/bootcamp/:id
//@access  public
exports.getBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //get a single bootcamp
    const bootcamps = await Bootcamp.findById({_id: req.params.id})
    if(!bootcamps){
        res.status(404).json({success: true, 
            msg:`Bootcamp with a ID of ${req.params.id} does not exits or have been deleted`,
            bootcamp: {}
        });
    }else{
        res.status(200).json({
            success: true,
             bootcamp: bootcamps
            });
    }

});

//@desc     post to bootcamp 
//@route    POST /api/v1/bootcamp
//@access   private
exports.createBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //create a bootcamp
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({
        success: true, 
        bootcamp: bootcamp
        });

});


//@desc     update bootcamp 
//@route    PUT /api/v1/bootcamp/:id
//@access   private
exports.updateBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
        //update a bootcamp
            const updateboot = await Bootcamp.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true, runValidators: true});
            //if the bootcamp does not exist
            if(!updateboot){
                res.status(404).json({
                    success: true,
                    msg: `Bootcamp with a ID of ${req.params.id} does not exits or have been deleted`,
                    bootcamp: {}
                });
            }
            else{
                res.status(200).json({
                    success: true,
                    bootcamp: updateboot,
                })
            }
    }
);

//@desc     delete bootcamp 
//@route    DELETE /api/v1/bootcamp/:id
//@access   private
exports.deleteBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //delete a bootcamp
        const deleteBoot = await Bootcamp.findById({_id: req.params.id});
        if(!deleteBoot){
            res.status(404).json({
                success: true,
                msg: `Bootcamp with a ID of ${req.params.id} does not exits or have been deleted`,
                bootcamp: {}
            });
        }else{
            
            deleteBoot.remove();
            res.json({
                success: true,
                DelMsg: "Bootcamp have been deleted!"
            }).status(200);
        }
});




//@desc     GET bootcamp within a radius 
//@route    GET /api/v1/bootcamp/radius/:zipCode/:miles
//@access   private
exports.getRadius = asyncHandler.handleAsync(async (req, res, next)=>{
    const {zipCode, miles} = req.params;

    //get lat and lng
    const loc = await geoCode.geoLocation(zipCode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calculate the radius
    //divide distance by earth radius = 3,958.8 mile
    const radius = miles / 3958.8;
    const bootcamps = await Bootcamp.find({

        location: {$geoWithin: {$centerSphere:  [[lng, lat], radius]}}
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        bootcamp: bootcamps
    });
});
//upload image
exports.picture = asyncHandler.handleAsync(async (req, res, next)=>{
    const bootcamp =  await Bootcamp.findById(req.params.id);
    //check for bootcamp
    if(!bootcamp){
        return next(new ErrorResponse('Bootcamp not found', 404));
    }
    //check if file is an image
    const file = req.files.pic;
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('please upload an image', 400));
    }
    //check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse('image file size is to large', 400));
    }
    //create custom name for img
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    log(file)

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async function(err){
        if(err){
            return next(new ErrorResponse(`Problem with uploading image`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        });
        res.status(200).json({
            success: true,
            photo: file.name

        })
    });



});