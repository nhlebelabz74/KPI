const { User } = require('../../models');
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
    const decryptedBytes = AES.decrypt(decodedEmail, secretKey);
    const decryptedEmail = decryptedBytes.toString(CryptoJS.enc.Utf8);

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

module.exports = {
  getUserByEmail,
};