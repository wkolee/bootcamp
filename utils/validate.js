const errorResponse = require('./errorResponse');

module.exports = function(email, password){
    if(!password || !email){
        throw new errorResponse('Please provide email and password', 400);
    }
}