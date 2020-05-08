const jwt = require('jsonwebtoken');

//send token to client side
sendTokenResponse = (user, statusCode, res)=>{
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

  module.exports = sendTokenResponse;