const nodemailer =require('nodemailer');

const sendMail = async (email, name, resetToken, urlLink, user)=>{
     // create reusable transporter object using the default SMTP transport
     try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_EMAIL, // generated ethereal user
              pass: process.env.SMTP_PASSWORD // generated ethereal password
            }
          });
        
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: process.env.FROM_EMAIL, // sender address
            to: email, // list of receivers
            subject: `Hello ${name}`, // Subject line
            text: `Hello ${name} your reset password token is ${resetToken},
            reset your password on the following link ${urlLink}
            `, // plain text body
            html: "<b>Hello world?</b>" // html body
          });
     }catch{
         
         user.resetPasswordToken = undefined;
         user.resetPasswordExpire =undefined;
         user.passwordResetAt = undefined;
         resetToken = undefined;
     }
 
  
}


module.exports = sendMail;