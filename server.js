const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
//load env vars
dotenv.config({path: './config/config.env' });

//connect to database
connectDB();

//load my own modules
const bootcampRoute = require('./routes/bootcamp');
const courseRoute = require('./routes/course');
const authRoute = require('./routes/auth');
const errorHandler = require('./middleware/error');
//const logger = require('./middleware/logger');







//middleware
//Dev login middle ware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload());

//app.use(logger);
app.use('/api/v1/bootcamps', bootcampRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/auth', authRoute);

//error handler have to be before "app.use('/api/v1/bootcamp', bootcampRoute)"
app.use(errorHandler);








const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is in ${process.env.NODE_ENV} mode and running on port ${PORT}`.yellow);
});



//handle unhandle promise rejection
process.on('unhandledRejection', (err, promise)=>{
    console.log(`ERORR: ${err.message}`.red.bold);
    //close server and exit process
    server.close(()=>process.exit(1));
});