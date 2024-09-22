const { StaffUser } = require("../../../../database/database");

const staffUserSubmitController = async (req, res) => {
  try {
    const data = req.body;
    console.log(req.user.id)
    data.UserId = req.user.id
    const newStaffUser = await StaffUser.create({ ...data })
    return res.json({ ...newStaffUser })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'POST',
  path: '/api/staff-user/submit',
  handler: staffUserSubmitController,
  requiresAuth: true,
  permissions: []
}