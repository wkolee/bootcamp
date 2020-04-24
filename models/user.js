const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        maxLength: 100,
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
    resetPasswordDate: {
        type: Date
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

//hash password before saving into database
userSchema.pre('save', async function (next) {
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

module.exports = mongoose.model('User', userSchema);