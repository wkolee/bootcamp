const express = require('express');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
//load env vars
dotenv.config({path: './config/config.env' });

//connect to database
connectDB();

//load my own modules
const bootcampRoute = require('./routes/bootcamp');
const errorHnadler = require('./middleware/error');
//const logger = require('./middleware/logger');







//middleware
//Dev login middle ware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());







//app.use(logger);
app.use('/api/v1/bootcamp', bootcampRoute);

//error handler have to be before "app.use('/api/v1/bootcamp', bootcampRoute)"
app.use(errorHnadler);








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