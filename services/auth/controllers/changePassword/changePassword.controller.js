const { generateJWTToken } = require("../../../../common/utils");
const { User, AccountVerification } = require("../../../../database/database");
const bcrypt = require('bcrypt');

const changePasswordController = async (req, res) => {
  try {
    const { email, newPassword, otp, guid } = req.body;

    const lowerCaseEmail = email.toLowerCase();
    const accountVerification = await AccountVerification.findOne({ where: { email: lowerCaseEmail, otp_code: otp, guid: guid } });
    const user = await User.findOne({ where: { email: lowerCaseEmail } });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (!accountVerification) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const token = generateJWTToken(user.email);

    return res.status(200).json({ message: "Password changed successfully", token: token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/change-password',
  handler: changePasswordController,
  requiresAuth: false,
  permissions: []
};
