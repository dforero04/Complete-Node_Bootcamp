const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express();

////////////////////////////////////////////
// Middleware
// A step the request goes through before hitting the endpoints.
// This one adds the data from the body to the request
app.use(morgan('dev'));
app.use(express.json());
// Custom middleware function
// applies to each and every request
app.use((req, res, next) => {
  console.log('Hello from from the middleware!')
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
