const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const geoCode = require('../utils/geoCode');
const log = require('../utils/log');

const BootcampSchema = new Schema({

    name: {
        type: String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'please add a description'],
        maxlength: [500, 'description can not be more than 500 characters']
    },
    website: {
        type: String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'please use a valid url with http or https'
        ]
    },
    phone: {
        type: String,
        maxlength:[
            20,
            'phone number can not be longer than 20'
        ]
    },
    email: {
        type: String,
        match:[
             /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please use a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'please add an address']
    },
    location: {
        type: {
            String, 
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        //Array of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10']
    },
    averageCost: {
        type: Number
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});





//ceate slugify middleware
BootcampSchema.pre('save', function(next){
    this.slug = slugify(this.name, "_", {lower: true});
next();
});

BootcampSchema.pre('save', async function(next){
    let loc = await geoCode.geoLocation(this.address);
    //log(loc[0].city);

    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }
//don't save the address
this.address = undefined;
    next();
});
module.exports = mongoose.model('Bootcamp', BootcampSchema);