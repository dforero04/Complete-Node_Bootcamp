const Review = require('../model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

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

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
