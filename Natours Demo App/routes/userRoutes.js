const express = require('express');
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser
} = require('./../controllers/userController')

const userRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = userRouter;