const express = require('express');
const { getOverview, getTour } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/pugIntro', (req, res) => {
  res.status(200).render('pugIntro', {
    tour: 'The Forest Hiker',
    user: 'Daniel'
  });
});

module.exports = router;
