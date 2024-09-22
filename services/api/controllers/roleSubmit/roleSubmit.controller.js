const { Role } = require('./../../../../database/database')

const roleSubmitController = async (req, res) => {
  const data = req.body;
  try {
    result = await Role.create({ ...data });
    return res.json({
      result
    })
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'POST',
  path: '/api/role/submit',
  handler: roleSubmitController,
  requiresAuth: false,
  permissions: []
};