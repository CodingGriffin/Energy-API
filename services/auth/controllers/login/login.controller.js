const { User } = require("../../../../database/database");
const { generateJWTToken } = require('../../../../common/utils');
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ where: { email: lowerCaseEmail } });
    if (!user) {
      return res.status(403).json({ message: 'User not found!' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json("Wrong password!");
    }

    const token = generateJWTToken(user.id, user.email, user.first_name, user.last_name);

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/auth/login',
  handler: loginController,
  requiresAuth: false,
  permissions: []
};
