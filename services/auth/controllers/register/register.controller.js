const bcrypt = require('bcrypt');

const { User, AccountVerification } = require("../../../../database/database");
const { generateJWTToken } = require('../../../../common/utils');

const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, otp, guid } = req.body;

    const lowerCaseEmail = email.toLowerCase();
    const verification = await AccountVerification.findOne({ where: { email: lowerCaseEmail, otp_code: otp, guid: guid } });
    if (!verification) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    const user = await User.findOne({ where: { email: lowerCaseEmail } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      first_name: firstName,
      last_name: lastName,
      email: lowerCaseEmail,
      password: hashedPassword,
      phone_number: phoneNumber
    });

    const token = generateJWTToken(lowerCaseEmail);

    res.status(201).json({ message: 'User registered successfully', token: token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/register',
  handler: registerController,
  requiresAuth: false,
  permissions: []
};
