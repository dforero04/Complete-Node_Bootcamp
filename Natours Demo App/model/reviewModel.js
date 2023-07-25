const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// The populate() method requires additional queries, so it may slow down application at scale
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name'
  });
  next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // This gets the Review document so that we can use the Tour field on it
  this.review = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // Actually updates the Tour document
  await this.review.constructor.calcRatingsAverage(this.review.tour);
});

reviewSchema.post('save', function () {
  // this points to the current document
  // this.constructor points to the Model that made it
  // so we can now call a static method on it
  this.constructor.calcRatingsAverage(this.tour);
});

reviewSchema.statics.calcRatingsAverage = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        numRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRatings,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
