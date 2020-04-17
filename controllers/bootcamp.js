const geoCode = require('../utils/geoCode');
const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');




//@desc     get all bootcamps 
//@route    GET /api/v1/bootcamp
//@access   public
exports.getBootcamps = asyncHandler.handleAsync( async (req, res, next)=>{
    //copied req.query
    const reqQuery = { ...req.query };

    //remove select
    const removeField = ['select', 'sort', 'page', 'limit'];

    //loop over params and remove 'select' or etc
    removeField.forEach(param => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //attach the $ sign before gt,gte,lt,lte
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //select fields
    if(req.query.select){
        const field = req.query.select.split(',').join(' ');
        query = query.select(field);
    }
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = await query.skip(startIndex).limit(limit); 

   
    //run query
      const bootcamps = await query;

    //pagnitation
    const pagination = {};

    if(endIndex < total){
        pagination.naxt = {
            page: page + 1,
            limit: limit
        }

    }
    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit: limit
        }

    }

      res.status(200).json({
          count: bootcamps.length,
          success: true,
          pagination: pagination,
          bootcamps: bootcamps,
      });  
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