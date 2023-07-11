const express = require('express');
const fs = require('fs');

const app = express();

// A step the request goes through before hitting the endpoints.
// This one adds the data from the body to the request
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
}
const getTourById = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(el => el.id === id)

  if (!tour) return res.status(404).json({
    status: 'fail',
    message: 'Invalid tour ID!'
  })

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
}
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "success",
      tours: newTour
    })
  })
}
const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length - 1) return res.status(404).json({
    status: 'fail',
    message: 'Invalid tour ID!'
  })

  res.status(200).json({
    status: 'success',
    data: {
      tour: "<updated tour here>"
    }
  })
}
const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length - 1) return res.status(404).json({
    status: 'fail',
    message: 'Invalid tour ID!'
  })

  res.status(204).json({
    status: 'success',
    data: null
  })
}

// Express allows you to just use the HTTP method as a function call
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// You can also chain HTTP methods from the route method if they all use the same route
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id').get(getTourById).patch(updateTour).delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
});
