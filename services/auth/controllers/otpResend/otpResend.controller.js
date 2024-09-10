const { EmailClient } = require("../../../../clients/emailClient");
const { generateOTP } = require("../../../../common/utils");
const { AccountVerification } = require("../../../../database/database");

const otpResendController = async (req, res) => {
  try {
    const { email, guid } = req.body;
    const newOtpCode = generateOTP();
    const currentTime = new Date();
    const expiration_time = new Date(currentTime.getTime() + 10 * 60000);

    const lowerCaseEmail = email.toLowerCase();
    const verification = await AccountVerification.findOne({ where: { email: lowerCaseEmail, guid } });
    if (!verification) {
      return res.status(404).json({ message: "OTP Code does not exist" });
    }

    const limit_time = new Date(verification.expiration_time.getTime() + 50 * 60 * 1000);

    if (limit_time < currentTime) {
      verification.resend_count = 0;
      verification.guid = guid;
      verification.otp_code = newOtpCode;
      verification.retry_count = 0;
      verification.expiration_time = expiration_time;
    }
    else if (verification.resend_count < 6) {
      verification.resend_count += 1;
      verification.guid = guid;
      verification.otp_code = newOtpCode;
      verification.retry_count = 0;
      verification.expiration_time = expiration_time;
    }
    else {
      return res.status(400).json({ message: "You've reached the limit. Try again 1h later." });
    }
    
    await verification.save();

    EmailClient.send(lowerCaseEmail, "Auth OTP", `Your auth OTP is: ${newOtpCode}`);

    return res.status(200).json({ email, guid });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/otp/resend',
  handler: otpResendController,
  requiresAuth: false,
  permissions: []
};
