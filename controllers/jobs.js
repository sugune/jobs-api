const StatusCodes = require('http-status-codes');
const Job = require('../models/Job');
const {
  UnauthenticatedError, 
  NotFoundError,
  BadRequestError
} = require('../errors');
const mongoose = require('mongoose');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt');
  res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}

const getJob = async (req, res) => {
  const {user:{userId}, params:{id:jobId}} = req;
  const job = await Job.findOne({_id: jobId, createdBy: userId});
  if (!job) {
    throw new NotFoundError(`There is no job with an id of: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({job});
}

const deleteJob = async (req, res) => {
  const {
    user: {userId},
    params: {id:jobId}
  } = req;
  if (!mongoose.isValidObjectId(jobId)) {
    throw new NotFoundError(`Invalid job ID: ${jobId}`);
  }
  
  const job = await Job.findByIdAndRemove({_id: jobId, createdBy: userId});
  console.log(job)
  if (!job) {
    throw new NotFoundError(`There is no job with an id of: ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
}

const updateJob = async (req, res) => {
  const {
    body: {company, position},
    user: {userId},
    params: {id: jobId}
  } = req;
  
  if(!mongoose.isValidObjectId(jobId)) {
    throw new NotFoundError(`Invalid job ID: ${jobId}`)
  }
  
  if (company === '' || position === '') {
    throw new BadRequestError('Please provide company and position');
  }
  const job = await Job.findByIdAndUpdate(
    {_id: jobId, createdBy: userId}, 
    req.body,
    {new: true, runValidators: true}
    )
  if (!job) {
    throw new NotFoundError(`There is no job with an id of: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({job});
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}