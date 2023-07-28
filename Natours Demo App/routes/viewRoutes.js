const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm
} = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

// // Pug intro demo
// router.get('/pugIntro', (req, res) => {
//   res.status(200).render('pugIntro', {
//     tour: 'The Forest Hiker',
//     user: 'Daniel'
//   });
// });

module.exports = router;
