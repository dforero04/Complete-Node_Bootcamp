const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

// JWT function that creates a JWT based on header, payload (user id and expires in), and secret
const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

const createSendToken = (user, statusCode, res) => {
  const jwtToken = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  };

  res.cookie('jwt', jwtToken, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    jwtToken,
    user: { user }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  // To not show password in response
  newUser.password = undefined;

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Email and password is required to login', 400));
  }
  // Check if user exists && password is correct
  // By chaining select(), we can add the password into our query response in order to check against the user inputted password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //If everything is ok, send token to client
  createSendToken(user, 200, res);
});

// Middleware function used for protected routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Get token and verify it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // Verify token by promisifying verify()
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists by using decoded JWT token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError('You are not a registered user.', 401));

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  // Add user info to request and continue to next middleware function
  req.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;

    // Verify token by promisifying verify()
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists by using decoded JWT token
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next();

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // Add user info to request and continue to next middleware function
    res.locals.user = currentUser;
    return next();
  }
  next();
});

// Middleware function used to restrict specific routes to specific user roles
// Restricts this route to roles passed in.
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('No user with provided email address.', 404));

  // Generate random reset token and save password reset info to user
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Send reset password token to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Reset your password at ${resetUrl}.\nIf you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpired = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the reset email. Please try again error.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Encrypt URL param token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Get user based on encrypted token and if token is not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If token is not expired and there is a user, set new password
  if (!user)
    return next(
      new AppError('Reset password token is invalid or has expired', 400)
    );
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // Actually modify user document
  await user.save();
  // Update changedPasswordAt property for user

  // Log user in (send JWT)
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, passwordUpdate, passwordUpdateConfirm } = req.body;

  // Get user
  const currentUser = await User.findById(req.user.id).select('+password');

  // Check if POSTed password is correct
  if (
    !(await currentUser.correctPassword(passwordCurrent, currentUser.password))
  )
    return next(
      new AppError(
        'Your current password does not match what you provided',
        400
      )
    );

  // Then update password
  currentUser.password = passwordUpdate;
  currentUser.passwordConfirm = passwordUpdateConfirm;
  await currentUser.save();

  // Login user by sending back JWT
  createSendToken(currentUser, 200, res);
});
