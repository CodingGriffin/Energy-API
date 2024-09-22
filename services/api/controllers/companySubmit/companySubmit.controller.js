const { Company } = require("../../../../database/database");

const companySubmitController = async (req, res) => {
  try {
    const data = req.body;
    const newCompany = await Company.create({ ...data })
    return res.json({ ...newCompany })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'POST',
  path: '/api/company/submit',
  handler: companySubmitController,
  requiresAuth: true,
  permissions: []
}