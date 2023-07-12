const express = require('express');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

// These routes are also part of the middleware stack
// This is called mounting a router. It creates a router for a specific subdomain
const router = express.Router();

// // This middleware function will only run on this router
// router.param('id', checkId);

// You can also chain HTTP methods from the route method if they all use the same route
// You can provide a middleware function inside these routes, like the checkBody() middleware function
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
