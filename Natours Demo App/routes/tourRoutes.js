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
const ReviewRouter = require('./reviewRoutes');
const { protect, restrictTo } = require('../controllers/authController');

// These routes are also part of the middleware stack
// This is called mounting a router. It creates a router for a specific subdomain
const router = express.Router();

router.use('/:tourId/reviews', ReviewRouter);

// Example for Route Alias
// Needs to be placed above the '/:id' route
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// You can also chain HTTP methods from the route method if they all use the same route
// You can provide a middleware function inside these routes, like the checkBody() middleware function
router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
