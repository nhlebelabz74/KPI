const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
  },
  answers: {
    type: [], 
    required: true,
  }
}, {
  _id: false, // no need for a separate ID for each answer
});

const AppraisalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appraisalPeriod: {
    type: String,
    required: true,
  },
  evaluated: {
    type: Boolean,
    default: false, // initially not evaluated
  },
  answers: { // format will be according to frontend specification
    type: [AnswerSchema],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appraisal', AppraisalSchema);