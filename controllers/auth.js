const User = require('../models/User');
const StatusCodes = require('http-status-codes');
const {BadRequestError} = require('../errors');
const {UnauthenticatedError} = require('../errors');

const login = async (req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  
  const user = await User.findOne({email});
  if(!user) {
    throw new UnauthenticatedError('invalid Credentials');
  }
  //compare password
  const isPasswordValid = await user.comparePassword(password);
  console.log(isPasswordValid)
  if(!isPasswordValid) {
    throw new UnauthenticatedError('invalid Credentials');
  }
  
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user: {name:user.name}, token})
  
}

const register = async (req, res) => {
  const user = await User.create({...req.body});
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({user: {name: user.name},token});
}

module.exports = {
  login,
  register
}