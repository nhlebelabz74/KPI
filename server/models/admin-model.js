const mongoose = require('mongoose');
const { positions } = require('../constants');

const AdminSchema = new mongoose.Schema({
  kpiNumbers: {
    type: [String],
    required: true,
    default: []
  },
  position: {
    type: String,
    enum: Object.values(positions),
    default: positions.CA,
    required: [true, 'Position is required'],
    trim: true,
  },
});

module.exports = mongoose.model('Admin', AdminSchema);