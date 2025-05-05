const jwt = require('jsonwebtoken');

const generateVerificationCode = (eight_digit_code) => {
  const payload = { eight_digit_code };
  const options = { expiresIn: '30m' }; // Set expiration time for the code
  const code = jwt.sign(payload, process.env.VERIFICATION_TOKEN_SECRET, options); // Use a secret key to sign the token
  return code;
}

module.exports = generateVerificationCode