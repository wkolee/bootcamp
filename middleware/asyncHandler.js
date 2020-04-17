module.exports = {

  handleAsync: (asyncFunction)=>{
    return (req, res, next) =>{
      Promise
      .resolve(asyncFunction(req, res, next))
      .catch(next);
    }

  }
};
