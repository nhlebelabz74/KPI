const { User, Admin, Response } = require('../../models');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const { asyncWrapper } = require('../../middleware');

const getUserByEmail = asyncWrapper(async (req, res) => {
  const { email } = req.params;
  const secretKey = process.env.ENCRYPTION_KEY || 'default_key';

  try {
    // First decode the URI component (in case it was encoded twice)
    const decodedEmail = decodeURIComponent(email);
    
    // Decrypt the email using AES
    const decryptedEmail = AES.decrypt(decodedEmail, secretKey).toString(CryptoJS.enc.Utf8);

    if (!decryptedEmail) {
      return res.status(400).json({ message: 'Invalid encrypted email' });
    }

    // Find the user by decrypted email
    const user = await User.findOne({ email: decryptedEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User found', user: user });
  } catch (error) {
    console.error('Decryption error:', error);
    return res.status(400).json({ message: 'Error decrypting email', error: error.message });
  }
});

const createUsers = asyncWrapper(async (req, res) => {
  const { users } = req.body;

  users.map(async (user) => {
    await User.create({ ...user });
  });

  return res.status(201).json({ message: 'Users created successfully' });
});

// get the KPI numbers that the user has to complete
// endpoint: /admin/get/info/:email
const getKPIInfo = asyncWrapper(async (req, res) => {
  const { email } = req.params
  const decodedEmail = decodeURIComponent(email);

  const user = await User.findOne({ email: decodedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const position = user.position;
  const responses = await Admin.find({ position: position });
  const kpiNumbers = responses[0].kpiNumbers;

  if (!kpiNumbers) { // not possible but just in case
    return res.status(404).json({ message: 'KPI numbers not found' });
  }

  return res.status(200).json({ message: 'KPI numbers found', kpiNumbers: kpiNumbers });
});

// get a list of all KPIs the user has completed
// endpoint: /users/get/completedKPIs/:email
const getCompletedKPIs = asyncWrapper(async (req, res) => {
  const { email } = req.params;
  const decodedEmail = decodeURIComponent(email);

  const user = await User.findOne({ email: decodedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const responses = await Response.find({ email: decodedEmail });
  const kpiNumbers = responses.map((response) => response.kpiNumber);

  return res.status(200).json({ 
    message: 'KPIs found', 
    completedKPIs: kpiNumbers 
  });
});

// temp function to add all the admin stuff
// endpoint: /create/admin-stuff/:position
const addAdmin = asyncWrapper(async (req, res) => {
  const { position } = req.params;
  const { kpiNumbers } = req.body;

  await Admin.create({ position, kpiNumbers });
  // if (!admin) {
  //   return res.status(404).json({ message: 'Admin stuff creation failed' });
  // }

  return res.status(200).json({ message: 'Admin stuff created' });
});

module.exports = {
  getUserByEmail,
  createUsers,
  getKPIInfo,
  getCompletedKPIs,
  addAdmin,
};