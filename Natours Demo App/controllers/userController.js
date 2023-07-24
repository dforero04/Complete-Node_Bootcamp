const User = require('../model/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { activeUser: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Send error if user tries to update password
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'You cannot update your password with this action. Please use /updatePassword',
        400
      )
    );

  // Get user and update info
  // filteredBody only accepts fields that are allowed to be changed e.g. a user cannot change their role 'admin'
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  // Send response
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});
