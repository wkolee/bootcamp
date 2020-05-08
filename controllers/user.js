const Bootcamp = require('../models/bootcamp');
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncHandler');
const log = require('../utils/log');
const User =  require('../models/user');
const bcrypt = require('bcryptjs');
const sendTokenResponse = require('../utils/sendTokenResponse');


module.exports = {
    currentUser : asyncHandler.handleAsync(async (req, res, next)=>{
        const user = await User.findById(req.user);
        res.status(200).json({success: true, data: user});
      }),
      user: asyncHandler.handleAsync(async (req, res, next)=>{
          const updates = {
              name: req.body.name,
              email: req.body.email
          }
        let user = await User.findByIdAndUpdate(req.user.id, updates, {new: true, runValidators: true});
        if(!user){
            return next(new ErrorResponse('no user', 404));
        }
    
        res.status(201).json({user});
    }),
    userpassword: asyncHandler.handleAsync(async(req,res,next)=>{
        const {currentPassword, newPassword} = req.body
        const user = await User.findById(req.user.id).select('+password');

        //check for currentpassword
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){return next(new ErrorResponse('password is incorrect', 401))}
        user.password = newPassword;
        await user.save(user);
        sendTokenResponse(user, 200, res)
    }),
    //admin get all user
    adminUsers: asyncHandler.handleAsync(async(req, res, next)=>{
        const users = await User.find();
        if(!users){return next(new ErrorResponse('no users', 404))}
        res.status(200).json({
            users
        });
    }),
    adminUpdate: asyncHandler.handleAsync(async (req, res, next)=>{
        const userInfo = {
            name: req.body.name,
            email: req.body.email
        }
        let user = await User.findById(req.params.userID);
        if(!user){return next(new ErrorResponse('user does not exist', 404))}

        user = await User.findByIdAndUpdate(req.params.userID, userInfo, {new: true, runValidators: true});
        res.status(200).json({
            user
        });
    }),
    adminPassword: asyncHandler.handleAsync(async (req, res, next)=>{
        //update user password
        const {newPassword} = req.body;
        const user = await User.findById(req.params.userID).select('+password');
        if(!user){return next(new ErrorResponse('user does not exsit', 404))}

        //set new password
        user.password = newPassword;
        await user.save(user);

        res.status(200).json({
            success: true,
            msg: 'updated successfully'
        })
    }),
    adminDelete: asyncHandler.handleAsync(async (req, res, next)=>{
        let user =  await User.findById(req.params.userID);
        if(!user){return next(new ErrorResponse('user does not exist', 404))}
        user = await User.deleteOne({_id: req.params.userID});
        res.status(200).json({
            success: true,
            msg: 'user been deleted'
        });
    })
}