const AppError = require('../utils/appError');

const handleDBCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDupFields = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
};

const handleDBValidationError = (err) => {
  const errorsArr = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errorsArr.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.error('Error: ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };

    if (err.name === 'CastError') error = handleDBCastError(error);
    if (err.code === 11000) error = handleDBDupFields(error);
    if (err.name === 'ValidationError') error = handleDBValidationError(error);
    sendErrorProd(error, res);
  }
};
