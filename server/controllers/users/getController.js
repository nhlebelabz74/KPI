const { User } = require('../../models');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const { asyncWrapper } = require('../../middleware');

// endpoint: /users/get
const getUserByEmail = asyncWrapper(async (req, res) => {
  const { email } = req.params;
  const secretKey = process.env.ENCRYPTION_KEY || 'default_key';

  // Decrypt the email using AES
  const decryptedEmail = AES.decrypt(email, secretKey).toString(CryptoJS.enc.Utf8);

  // Find the user by decrypted email
  const user = await User.findOne({ email: decryptedEmail });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'User found', user });
});

module.exports = {
  getUserByEmail,
};