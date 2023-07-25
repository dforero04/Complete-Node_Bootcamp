const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReviewById,
  setTourUserIds
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

// mergeParams is used for nested routes
// Allows a nested route to use URL params
const reviewRouter = express.Router({ mergeParams: true });

// Protected Routes
reviewRouter.use(protect);
reviewRouter
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createReview);

reviewRouter
  .route('/:id')
  .get(getReviewById)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = reviewRouter;
