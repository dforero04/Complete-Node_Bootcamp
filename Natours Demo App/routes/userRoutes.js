const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo
} = require('../controllers/authController');

const userRouter = express.Router();

// Unprotected Routes
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

// Protected Routes
userRouter.use(protect);
userRouter.patch('/updatePassword', updatePassword);
userRouter.get('/me', getMe, getUserById);
userRouter.patch('/updateMe', updateMe);
userRouter.delete('/deleteMe', deleteMe);

// Protected Admin Routes
userRouter.use(restrictTo('admin'));
userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
