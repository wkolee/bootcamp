const mongoose = require('mongoose');


const connectDB = async()=>{
    const conn = await mongoose.connect(process.env.DATABASE_CON, {useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`MongoDB Connected: to ${conn.connection.host}`.blue.bold);
}

module.exports = connectDB;