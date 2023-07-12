const Tour = require('../model/tourModel');

// // Used before DB
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// // Used to show an example of a middleware function
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (val > tours.length - 1)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid tour ID!'
//     });
//   next();
// };

// // Used to demonstrate a middleware function
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Tour name and price not provided!'
//     });
//   next();
// };

////////////////////////////////////////////
// Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // One way to include a query string for filtering results
    const query = Tour.find(JSON.parse(queryStr));

    // // Another way to include a query string
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const savedTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { savedTour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour with ${req.params.id} ID found!`
      });
    }
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedTour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour with ${req.params.id} ID found`
      });
    }

    res.status(200).json({
      status: 'success',
      data: { updatedTour }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      return res.status(404).json({
        status: 'fail',
        message: `No tour with ${req.params.id} ID found`
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    });
  }
};
