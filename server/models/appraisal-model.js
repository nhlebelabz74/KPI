const mongoose = require('mongoose');

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
  answers: { // format will be according to frontend specification
    type: [{}],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appraisal', AppraisalSchema);