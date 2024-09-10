const nodemailer = require('nodemailer');

class EmailClient {

  static async send(to, subject, body) {

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hatronikaenergy@gmail.com',
          pass: 'yxkv vzoh yxwv sdvf',
        },
      });

      const mailOptions = {
        from: 'hatronikaenergy@gmail.com',
        to: to,
        subject: subject,
        text: body,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = {
  EmailClient
};