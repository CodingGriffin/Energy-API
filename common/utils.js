const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_TIMEOUT} = require('./constants');

const generateJWTToken = (id, email, first_name, last_name) => {
  const token = jwt.sign({ id, email, first_name, last_name }, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
  return token;
};

const generateOTP = () => {
  const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP
  return otpCode;
};

module.exports = {
  generateJWTToken,
  generateOTP
};