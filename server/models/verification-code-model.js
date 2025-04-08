const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const VerifcicationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('VerificationCode', VerifcicationCodeSchema);