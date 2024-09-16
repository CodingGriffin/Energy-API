const { System } = require("../../../../database/database");

const tenderGetController = async (req, res) => {
  try {
    const data = await System.findAll();
		return res.status(200).json([ ...data ]);
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'GET',
  path: '/api/tender',
  handler: tenderGetController,
  requiresAuth: false,
  permissions: []
};