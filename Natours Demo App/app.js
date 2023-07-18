const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

////////////////////////////////////////////
// Middleware
// A step the request goes through before hitting the endpoints.

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// This one adds the data from the body to the request (body parser)
app.use(express.json({ limit: '10kb' }));

// Data sanitization middleware against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization middleware against XSS

// Serving static files
app.use(express.static(`${__dirname}/public`));

// // Custom middleware function
// // applies to each and every request
// app.use((req, res, next) => {
//   console.log('Hello from from the middleware!');
//   next();
// });

// Express rate limit, which allows only a certain number of requests from a specific IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again in 1 hour'
});
app.use('/api', limiter);

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
