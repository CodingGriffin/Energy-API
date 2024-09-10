const { EmailClient } = require("../../../../clients/emailClient");
const { generateOTP } = require("../../../../common/utils");
const { AccountVerification } = require("../../../../database/database");
const { v4: uuidv4 } = require('uuid');

const otpSendController = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = generateOTP();
    const guid = uuidv4();
    const currentTime = new Date();
    const expiration_time = new Date(currentTime.getTime() + 10 * 60 * 1000);

    const lowerCaseEmail = email.toLowerCase();
    const verification = await AccountVerification.findOne({ where: { email: lowerCaseEmail } });
    if (!verification) {
      await AccountVerification.create({
        email: lowerCaseEmail,
        otp_code: otpCode,
        guid: guid,
        resend_count: 0,
        retry_count: 0,
        expiration_time: expiration_time
      });
    }
    else {

      const limit_time = new Date(verification.expiration_time.getTime() + 50 * 60 * 1000);

      if (limit_time < currentTime) {
        verification.resend_count = 0;
        verification.guid = guid;
        verification.otp_code = otpCode;
        verification.retry_count = 0;
        verification.expiration_time = expiration_time;
      }
      else if (verification.resend_count <= 3) {
        verification.resend_count += 1;
        verification.guid = guid;
        verification.otp_code = otpCode;
        verification.retry_count = 0;
        verification.expiration_time = expiration_time;
      }
      else {
        return res.status(400).json({ message: "Maximum otp reached, try again 1h later" });
      }

      await verification.save();
    }

    //Send OPT Code via email
    EmailClient.send(lowerCaseEmail, "Auth OTP", `Your auth OTP is: ${otpCode}`);

    return res.status(200).json({ email, guid });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/otp/send',
  handler: otpSendController,
  requiresAuth: false,
  permissions: []
};
