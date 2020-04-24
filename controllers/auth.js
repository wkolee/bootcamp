const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');
const User = require('../models/user');
const validate = require('../utils/validate');

//register users
exports.userRegister = asyncHandler.handleAsync( async (req, res, next)=>{
  const {name, email, password, role} = req.body;
  
  //create user
  const user =  await User.create({
      name,
      email, 
      password, 
      role
  });

  //user sign token
  sendTokenResponse(user, 200, res);

});

exports.userLogin = asyncHandler.handleAsync(async (req, res, next)=>{
  const {email, password} = req.body;
  //validate user login info
  validate(email, password);
 
  //look for user
  const user = await User.findOne({email}).select('+password');

  //check to see if user email exist
  if(!user){
    return next(new ErrorResponse('invalid credentials', 401));
  }
  //check password;
 const passExist =  await user.passwordMatch(password, user.password);
 if(!passExist){
   return next(new ErrorResponse('invalid credentials', 401));
 }

  sendTokenResponse(user, 200, res);

});

//send token to client side
const sendTokenResponse = (user, statusCode, res)=>{
  const token = user.signToken();
  const options = {
    expires: new Date(Date.now() + 60 * 60 * 1000) ,// 1 hour
    httpOnly: true
  };
  if(process.env.NODE_ENV === 'production'){
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};


exports.currentUser = asyncHandler.handleAsync(async (req, res, next)=>{
  const user = await User.findById(req.user);
  res.status(200).json({success: true, data: user});
});