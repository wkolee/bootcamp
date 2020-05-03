const mongoose = require('mongoose');
const log = require('../utils/log');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: Number,
        required: [true, 'Please add numbers of weeks offer']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum skills level'],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false
    },
    creatAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//calculate avarge cost
CourseSchema.statics.getAvergeCost = async function (bootcampId) {
    
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: {
                    $avg: '$tuition'
                }
            }
        }
    ]);
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, 
            {averageCost: Math.ceil(obj[0].averageCost / 10) * 10}
            );
    } catch (err) {
        console.error(err);
    }
}

//GET avargeCost after save
CourseSchema.post('save',  function() {
     this.constructor.getAvergeCost(this.bootcamp);

});

//recalculate avarage cost after a course been remove
CourseSchema.pre('remove',  function(){
     this.constructor.getAvergeCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);