const mongoose = require('mongoose');

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
    creatAt : {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
});

module.exports = mongoose.model('Course', CourseSchema);