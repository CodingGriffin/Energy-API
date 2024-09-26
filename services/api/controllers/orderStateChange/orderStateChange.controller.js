const { System } = require("../../../../database/database");

const orderStateChangeController = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;
    const newCompanyType = await CompanyType.find({ ...data })
    return res.json({ ...newCompanyType })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'POST',
  path: '/api/order/:id',
  handler: orderStateChangeController,
  requiresAuth: true,
  permissions: []
}