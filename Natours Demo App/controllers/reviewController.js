const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // This filter is used to get a specific tour ID and the reviews for that tour
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const savedReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: savedReview
  });
});

exports.deleteReview = factory.deleteOne(Review);
