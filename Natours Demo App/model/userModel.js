const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'A user must have a valid email e.g. name@mail.com'
    ]
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
