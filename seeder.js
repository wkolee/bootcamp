const fs = require('fs');
const mongoose = require('mongoose');
const color = require('colors');
const dotenv = require('dotenv');
const log = require('./utils/log');


dotenv.config({path:'./config/config.env'});

//load model
const Bootcamp = require('./models/bootcamp');

//load courses model
const Course = require('./models/courses');

mongoose.connect(process.env.DATABASE_CON, 
{
        useCreateIndex: true, 
        useFindAndModify: false, 
        useNewUrlParser: true, 
        useUnifiedTopology: true
});

//read json file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//import Bootcamp data into database
const importData = async ()=>{
    try{
        await Bootcamp.create(bootcamps);
        log('DATA IMPORTED'.green.inverse);
        process.exit();
    }
    catch(err){
        console.error(err)
    }
}

//delete Bootcamp data
const delData = async ()=>{
   try {
       await Bootcamp.deleteMany();
       log('ALL DATA HAVE BEEN DESTROY'.red.inverse);
       process.exit();
   } catch (err) {
       console.error(err);
   }
}


//import courses
const importCourse = async ()=>{
    try {
        await Course.create(courses);
        log('COURSES BEEN IMPORTED'.green.inverse);
    } catch (err) {
        console.error(err);
    }
    
}
//delete courses
const delCourses = async ()=>{
    try {
        await Course.deleteMany();
        log('COURSES BEEN DELETED'.red.inverse);
    } catch (err) {
        console.error(err);
    }
}


if(process.argv[2] === '-i'){
    importData();
    importCourse();
}else if(process.argv[2] === '-d'){
    delData();
    delCourses();
}