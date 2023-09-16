const errorMiddleware = (err, req, res, next) => {
  

  var defaultError =err;
  if(err.errors){
    var p=Object.values(err.errors)
    p.map((item)=>{
        if(item.name === "ValidatorError"){
            defaultError=item.message
        }
    })
    
  }
  res.status(400).send({
    success: false,
    message: defaultError,
  });
};

module.exports = errorMiddleware;
