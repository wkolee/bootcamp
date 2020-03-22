const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');

//@desc     get all bootcamps 
//@route    GET /api/v1/bootcamp
//@access   public
exports.getBootcamps = asyncHandler.handleAsync( async (req, res, next)=>{
    //get all bootcamps info from database using async
      const bootcamps = await Bootcamp.find();
      res.status(200).json({
          count: bootcamps.length,
          success: true,
          data: bootcamps,
      });  
});

//@desc    get a single bootcamp 
//@route   GET /api/v1/bootcamp/:id
//@access  public
exports.getBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //get a single bootcamp
    const bootcamp = await Bootcamp.findById({_id: req.params.id})
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
    }else{
        res.status(200).json({success: true, data: bootcamp})
    }

});

//@desc     post to bootcamp 
//@route    POST /api/v1/bootcamp
//@access   privte
exports.createBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //create a bootcamp
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({
        success: true, 
        data: bootcamp
        });
});


//@desc     update bootcamp 
//@route    PUT /api/v1/bootcamp/:id
//@access   privte
exports.updateBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
        //update a bootcamp
            const updateboot = await Bootcamp.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true, runValidators: true});
            //if the bootcamp does not exist
            if(!updateboot){
                return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
            }
            else{
                res.status(200).json({
                    success: true,
                    data: updateboot,
                })
            }
    }
);

//@desc     delete bootcamp 
//@route    DELETE /api/v1/bootcamp/:id
//@access   privte
exports.deleteBootcamp = asyncHandler.handleAsync(async (req, res, next)=>{
    //delete a bootcamp
        const deleteBoot = await Bootcamp.findOneAndDelete({_id: req.params.id});
        if(!deleteBoot){
            return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
        }else{
            res.send({
                success: true,
                DelMsg: "Bootcamp have been deleted!"
            }).status(200);
        }
});