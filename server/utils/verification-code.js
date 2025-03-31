const jwt = require('jsonwebtoken');

const generateVerificationCode = (email) => {
  const payload = { email };
  const options = { expiresIn: '30m' }; // Set expiration time for the code
  const code = jwt.sign(payload, process.env.VERIFICATION_TOKEN_SECRET, options); // Use a secret key to sign the token
  return code;
}

const verifyCode = (code) => {
  try {
    const decoded = jwt.verify(code, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateVerificationCode,
  verifyCode,
};