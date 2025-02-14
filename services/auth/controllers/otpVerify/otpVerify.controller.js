const { generateJWTToken } = require("../../../../common/utils");
const { AccountVerification } = require("../../../../database/database");
const { User } = require("../../../../database/database")

const otpVerifyController = async (req, res) => {
  try {
    const { email, otp, guid } = req.body;
    const currentTime = new Date();

    const lowerCaseEmail = email.toLowerCase();
    const verification = await AccountVerification.findOne({ where: { email: lowerCaseEmail, guid } });
    const user = await User.findOne({ where: { email: lowerCaseEmail } })
    if (!verification) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (verification.retry_count > 3) {
      return res.status(400).json({ message: "Maximum retries reached" });
    }

    verification.retry_count += 1;
    await verification.save();

    if (verification.otp_code != otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (currentTime > verification.expiration_time) {
      return res.status(400).json({ message: 'Expired OTP' });
    }
    const data = { message: 'OTP verified successfully', guid: guid }
    if (user) {
      data.token = generateJWTToken(user.id, user.email)
      data.first_name = user.first_name;
      data.last_name = user.last_name;
      data.phone_number = user.phone_number;
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/otp/verify',
  handler: otpVerifyController,
  requiresAuth: false,
  permissions: []
};
