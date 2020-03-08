const ErrorResponse = require('../utils/errorResponse')
const log = require('../utils/log')


const errorHnadler = (err, req, res, next)=>{
    let error = { ...err };
    error.message = err.message;
    log(error.message);

    //mongoose bad object ID
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with ID of ${err.value}`;
        log(err.value);
        error = new ErrorResponse(message, 404);
        //log(error);
           
    }
    log(error);


    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });

}

module.exports = errorHnadler;