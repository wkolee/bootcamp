const ErrorResponse = require('../utils/errorResponse')
const log = require('../utils/log')

const errorHandler = (err, req, res, next)=>{
    let error = { ...err };
    
    error.message = err.message;

    //log(err)
    //log(err.name) 
    //mongoose bad object ID
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with ID of ${err.value._id}`;
        //log(err.value);
        error = new ErrorResponse(message, 404);
        //log(error);    
    }

    //check for mongoose duplicate key
    if(err.code === 11000){
        //do something
        const message = `Duplicate key value field entered '${err.keyValue.name}'`;
        error = new ErrorResponse(message, 400);
    }

    //check for validation of fields
    if(err.name === 'ValidationError'){
            const msgArry = Object.values(err.errors).map(val => val.message);        
            message = `${msgArry}`
            error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
}



module.exports = errorHandler;