const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');
const User = require('../models/user');
const validate = require('../utils/validate');
const sendMail = require('../utils/sendEmail');
const Crypto = require('crypto');
const sendTokenResponse = require('../utils/sendTokenResponse');

//register users
exports.userRegister = asyncHandler.handleAsync( async (req, res, next)=>{
  const {name, email, password, role} = req.body;
  validate(email, password);
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
//forgot password route
exports.forgotPassword = asyncHandler.handleAsync(async (req, res, next)=>{
  let user = await User.findOne({email: req.body.email});
  if(!user){return next(new ErrorResponse('no user by that email exist', 404))}

  //get reset password token
  const resetToken =  user.getresetToken();
  const name = user.email.split('@')[0];
  const urlLink = `${req.protocol}:/${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  sendMail(user.email, name, resetToken, urlLink, user);
  log(urlLink)
  await user.save({validateBeforeSave: false});
  res.status(200).json({
    success: true,
    msg: `Email sent to ${user.email}`
  });
  
});

exports.resetPassword = asyncHandler.handleAsync(async (req, res, next)=>{
  //hash the incoming token params 
  const resetPasswordToken = Crypto.createHash('sha256')
  .update(req.params.token)
  .digest('hex');
  
  /**find the user by reset token and 
    make sure the expired date is
    not greter then now
  **/
 let user = await User.findOne({resetPasswordToken, resetPasswordExpire: {
   $gte: Date.now()
 } }).select('-password');
 if(!user){
   return next(new ErrorResponse('Invalid token', 404));
 }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save(user);

  sendTokenResponse(user, 200, res);
});



exports.logout = asyncHandler.handleAsync(async(req, res, next)=>{
  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  
  res.status(200).json({success: true})
})