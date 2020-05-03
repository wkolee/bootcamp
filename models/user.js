const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Please add a email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'please use a valid email'
        ]
    },
    name: {
        type: String,
        required: [true, 'please add your name']
    },
    password: {
        type: String,
        required: [true, 'please add your password'],
        minLength: 7,
        maxLength: 200,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire:{
        type: Date
    },
    passwordResetAt: {
        type: Date
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

//hash password before saving into database
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});


//get jwt token for user model
userSchema.methods.signToken = function () {
    return jwt.sign({
            id: this._id
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRED
        }
    );
}
//compare password at login
userSchema.methods.passwordMatch = async function(plainPassword, hashPassword){
    return await bcrypt.compare(plainPassword, this.password);
}

userSchema.methods.getresetToken = function(){
    //generate random bytes
    const resetToken = Crypto.randomBytes(20).toString('hex');
  
    //hash token and set it to resetPasswordToken
    this.resetPasswordToken = Crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex');
     //set when password was updated
    this.passwordResetAt = Date.now();
   //set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    //console.log(typeof resetToken)
    return resetToken;
    
}

module.exports = mongoose.model('User', userSchema);