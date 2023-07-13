const express = require('express');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');

// These routes are also part of the middleware stack
// This is called mounting a router. It creates a router for a specific subdomain
const router = express.Router();

// Example for Route Alias
// Needs to be placed above the '/:id' route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

// You can also chain HTTP methods from the route method if they all use the same route
// You can provide a middleware function inside these routes, like the checkBody() middleware function
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
