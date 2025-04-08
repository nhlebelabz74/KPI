const { asyncWrapper } = require('../../middleware');
const { User, Response } = require('../../models');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const { KPI_Types: types } = require('../../constants');

// endpoint: /users/update/response
const updateResponse = asyncWrapper(async (req, res) => {
  const { email, kpiNumber, question, type, answer, documents, documents_metadata } = req.body;

  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
  if (!decryptedEmail) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Find the user by email
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // check that type is valid
  if (!Object.values(types).includes(type)) {
    return res.status(400).json({ message: 'Invalid KPI type' });
  }

  // check if answer and question are present
  if (!answer || !question) {
    return res.status(400).json({ message: 'Answer and question are required' });
  }

  // find the response by kpiNumber and email
  const response = await Response.findOne({ kpiNumber: kpiNumber, email: decryptedEmail });

  // create response if it doesn't exist
  if (!response) {
    await Response.create({
      kpiNumber: kpiNumber,
      email: decryptedEmail,
      question: question,
      kpiType: type,
      answer: answer,
      documents: documents,
      documents_metadata: documents_metadata,
    });
  }
  else {
    // update response if it exists
    response.answer = answer; // an object
    response.documents = documents; // only docs and answer are updated since the question can'won't ever change
    response.documents_metadata = documents_metadata;
    await response.save();
  }

  res.status(200).json({ message: 'Response updated successfully' });
});

// endpoint: /users/get/response/:email/:kpiNumber
const getResponse = asyncWrapper(async (req, res) => {
  const { email, kpiNumber } = req.params;

  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
  if (!decryptedEmail) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Find the user by email
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // find the response by kpiNumber and email
  const response = await Response.findOne({ kpiNumber: kpiNumber, email: decryptedEmail });
  if (!response) {
    return res.status(404).json({ message: 'Response not found' });
  }

  res.status(200).json({ message: 'Response found', response: response });
});

module.exports = {
  updateResponse,
  getResponse,
};