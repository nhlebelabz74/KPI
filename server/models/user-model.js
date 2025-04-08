const mongoose = require('mongoose');
const { positions } = require('../constants');

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
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
  },
  position: {
    type: String,
    enum: Object.values(positions),
    default: positions.CA,
    required: [true, 'Position is required'],
    trim: true,
  },
  supervising: {
    type: Array,
    default: []
  },
  budget: {
    type: mongoose.Schema.Types.Decimal128, // For precise decimal storage
    default: 0.00,
    get: (v) => parseFloat(v.toString()) // Convert back to float when retrieving
  },
  refreshToken: {
    type: String,
    default: '',
  },
}, {
  toJSON: { getters: true }, // Ensure getters are applied when converting to JSON
  toObject: { getters: true } // Ensure getters are applied when converting to plain objects
});

module.exports = mongoose.model('User', userSchema);