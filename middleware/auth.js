const asyncHandler  = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const log = require('../utils/log');
const User = require('../models/user');


//PROTECT ROUTE
exports.protectRoute = asyncHandler.handleAsync(async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        
    }else if(req.cookies.token){  
        token = req.cookies.token;
    }

   //make sure token exist
   if(!token){
        return next(new ErrorResponse('Not Authorize', 401))
   }
   //verify token
   try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = await User.findById(decoded.id);
       next();
   } catch (err) {
        return next(new ErrorResponse('Not Authorize', 401))
   }
});

//authorize user by roles
exports.authorize =  (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User with the role of ${req.user.role} does not have access`, 403))
        }
        next();
    }

}