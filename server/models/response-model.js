const mongoose = require('mongoose');
const { KPI_Types: types } = require('../constants');

const responseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  kpiNumber: {
    type: String,
    required: true,
  },
  kpiType: {
    type: String,
    enum: Object.values(types),
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: Object, // example: { cb1: true, cb2: false, progress1: "7/8", text: "some text" }
    required: true,
  },
  documents: {
    type: String
  },
  documents_metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Response', responseSchema);