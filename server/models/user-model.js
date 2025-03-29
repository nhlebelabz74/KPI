const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
  },
  refreshToken: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', userSchema);