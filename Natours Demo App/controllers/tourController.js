const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (val > tours.length - 1) return res.status(404).json({
    status: 'fail',
    message: 'Invalid tour ID!'
  });
  next();
}

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) return res.status(400).json({
    status: 'fail',
    message: 'Tour name and price not provided!'
  });
  next();
}

////////////////////////////////////////////
// Route Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  })
}
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "success",
      tours: newTour
    })
  })
}
exports.getTourById = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(el => el.id === id)

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: "<updated tour here>"
    }
  })
}
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
}