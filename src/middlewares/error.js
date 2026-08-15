const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const { Prisma } = require('@prisma/client');

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    if (error.response) {
      const message = error.response.data.message || error.response.data;
      const statusCode = error.response.status || 500;

      logger.info('handleAxiosError');
      error = new ApiError(statusCode, message, false, err.stack);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      logger.info('handlePrismaError');
      error = handlePrismaClientError(err);
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
      error = new ApiError(500, `Prisma Initialization Error: Database Connection Issues`);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      console.error(':', err.message);
      error = new ApiError(500, `Prisma Validation Error: Invalid Input Data`);
    } else {
      // PENGAMAN 1: Jika statusCode tidak ada/undefined, paksa ke angka 500
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

const handlePrismaClientError = (err) => {
  switch (err.code) {
    case 'P2002':
      return new ApiError(400, `Duplicate field value: ${err.meta?.target || ''}`, false, err.stack);
    case 'P2014':
      return new ApiError(400, `Invalid ID: ${err.meta?.target || ''}`, false, err.stack);
    case 'P2003':
      return new ApiError(400, `Invalid input data: ${err.meta?.target || ''}`, false, err.stack);
    default:
      return new ApiError(500, `Something went wrong: ${err.message}`, false, err.stack);
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;


  if (!statusCode || typeof statusCode !== 'number') {
    statusCode = 500;
  }

  if (config.env === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message: message || 'An error occurred',
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
