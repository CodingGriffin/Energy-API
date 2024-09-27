const { System } = require("../../../../database/database");

const orderStateChangeController = async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status;
    const system = await System.findByPk(id)
    system.status = status;
    const newState = await system.save()
    return res.json(newState)
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'PUT',
  path: '/api/order/:id',
  handler: orderStateChangeController,
  requiresAuth: true,
  permissions: []
}