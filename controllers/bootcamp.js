const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')

//@desc     get all bootcamps 
//@route    GET /api/v1/bootcamp
//@access   public
exports.getBootcamps = async (req, res, next)=>{
  try{
      //get all bootcamps info from database using async
    const bootcamps = await Bootcamp.find();
    res.send({
        count: bootcamps.length,
        success: true,
        data: bootcamps,
    }).status(200);
  }
  catch(err){
    //res.send({sucess: false, erorr: err}).status(400);
    next(err);
  }
   
};


//@desc    get a single bootcamp 
//@route   GET /api/v1/bootcamp/:id
//@access  public
exports.getBootcamp = async (req, res, next)=>{
    //get a single bootcamp
    try{
        const bootcamp = await Bootcamp.findById({_id: req.params.id})
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
        }else{
            res.status(200).json({success: true, data: bootcamp})
        }
    }
    catch(err){
        next(err);
    }
};


//@desc     post to bootcamp 
//@route    POST /api/v1/bootcamp
//@access   privte
exports.createBootcamp = async (req, res, next)=>{
    //create a bootcamp
    try{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(200).json({
        success: true, 
        data: bootcamp
        });
    }catch(err) {
        next(err);
    }
};


//@desc     update bootcamp 
//@route    PUT /api/v1/bootcamp/:id
//@access   privte
exports.updateBootcamp = async (req, res, next)=>{
    //update a bootcamp
    try {
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
    } catch (err) {
        next(err);
    }
};


//@desc     delete bootcamp 
//@route    DELETE /api/v1/bootcamp/:id
//@access   privte
exports.deleteBootcamp = async (req, res, next)=>{
    //delete a bootcamp
    try {
        const deleteBoot = await Bootcamp.findOneAndDelete({_id: req.params.id});
        if(!deleteBoot){
            return next(new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404))
        }else{
            res.send({
                success: true,
                DelMsg: "Bootcamp have been deleted!"
            }).status(200);
        }
       
    } catch (err) {
        next(err);
    }
};