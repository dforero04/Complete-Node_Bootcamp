const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm
} = require('../controllers/viewController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.get('/', getOverview);

router.get('/tour/:slug', protect, getTour);

router.get('/login', getLoginForm);

router.get('/pugIntro', (req, res) => {
  res.status(200).render('pugIntro', {
    tour: 'The Forest Hiker',
    user: 'Daniel'
  });
});

module.exports = router;
