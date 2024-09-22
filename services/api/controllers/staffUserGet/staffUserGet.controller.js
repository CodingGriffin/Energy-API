const { User } = require("../../../../database/database");
const { StaffUser } = require("../../../../database/database");

const staffUserSubmitController = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: StaffUser
        }
      ]
    })
    console.log(user.dataValues)
    res.json({ ...user })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'GET',
  path: '/api/user/staff-user',
  handler: staffUserSubmitController,
  requiresAuth: true,
  permissions: []
}