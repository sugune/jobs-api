const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  let customError = {
    //set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(item => item.message).join(',');
    customError.message = msg;
    customError.statusCode = 400;
  }
  
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please provide another value`
    customError.statusCode = 400;
  }
  
  if (err.name === 'CastError') {
    customError.message = `no item was found with an id of: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({message: customError.message})
}

module.exports = errorHandlerMiddleware
