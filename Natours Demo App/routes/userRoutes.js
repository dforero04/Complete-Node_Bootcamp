const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.patch('/updateMe', protect, updateMe);
userRouter.delete('/deleteMe', protect, deleteMe);

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
