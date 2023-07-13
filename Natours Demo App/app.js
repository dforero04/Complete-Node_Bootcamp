const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

////////////////////////////////////////////
// Middleware
// A step the request goes through before hitting the endpoints.
// This one adds the data from the body to the request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

//How to serve static files
app.use(express.static(`${__dirname}/public`));

// // Custom middleware function
// // applies to each and every request
// app.use((req, res, next) => {
//   console.log('Hello from from the middleware!');
//   next();
// });

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Used to handle requests to unknown endpoints
// Must be put below all other routes since middleware runs sequentially
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
