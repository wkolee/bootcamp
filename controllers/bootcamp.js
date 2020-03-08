const Bootcamp = require('../models/bootcamp');

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
    res.send({sucess: false, erorr: err}).status(400);
  }
   
};


//@desc    get a single bootcamp 
//@route   GET /api/v1/bootcamp/:id
//@access  public
exports.getBootcamp = async (req, res, next)=>{
    //get a single bootcamp
    try{
        const bootcamp = await Bootcamp.findById({_id: req.params.id})
        res.send({
            data: bootcamp,
            success: true,
        }).status(200);
    }
    catch(err){
        res.send({success: false, erorr: err}).status(400);
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
        res.status(400).json({success: false, erorr: err});
    }
};


//@desc     update bootcamp 
//@route    PUT /api/v1/bootcamp/:id
//@access   privte
exports.updateBootcamp = async (req, res, next)=>{
    //update a bootcamp
   try {
       const updateboot = await Bootcamp.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true})
       res.send({
           success: true,
           data: updateboot
       }).status(200);
   } catch (err) {
    res.status(400).json({success: false, error: err});
   }
};


//@desc     delete bootcamp 
//@route    DELETE /api/v1/bootcamp/:id
//@access   privte
exports.deleteBootcamp = async (req, res, next)=>{
    //delete a bootcamp
    try {
        const deleteBoot = await Bootcamp.findOneAndDelete({_id: req.params.id});
        res.send({
            success: true,
            DelMsg: "Bootcamp have been deleted!"
        }).status(200);
    } catch (err) {
        res.send({
            success: false,
            error: err
        }).status(400);
        
    }
};