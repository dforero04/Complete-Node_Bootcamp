const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'Tour name must be less than or equal to 40 characters'],
      minLength: [
        10,
        'Tour name must be greater than or equal to 10 characters'
      ]
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be easy, medium, or hard'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than or equal to 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (val) {
          // This only points to current document on NEW document creation, not UPDATE document
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be less than regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // Do not show in query results
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // For MongoDB GeoJSON, type and coordinates are required
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ]
  },
  {
    // Used to show virtual properties in the results
    toJSON: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware
// Runs before provided mongoDB method
// The THIS keyword points to the current document
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', (next) => {
//   console.log('will save document');
//   next();
// });
//
// // Runs after provided mongoDB method
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// Query Middleware
// Runs before provided mongoDB query method
// This REGEX makes it run for all find methods
// The THIS keyword points to the current query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregate Middleware
// Runs before provided mongoDB aggregate method
// The THIS keyword points to the current aggregate
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
