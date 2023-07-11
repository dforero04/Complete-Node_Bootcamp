const express = require('express');
const {
  getAllTours, createTour, getTourById, updateTour, deleteTour
} = require('./../controllers/tourController')

//////////////////////////////////////////
// Routes
// Express allows you to just use the HTTP method as a function call
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// These routes are also part of the middleware stack
// This is called mounting a router. It creates a router for a specific subdomain
const router = express.Router();
// You can also chain HTTP methods from the route method if they all use the same route
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;