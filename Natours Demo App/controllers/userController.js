const User = require('../models/userModel');
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

exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { activeUser: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
