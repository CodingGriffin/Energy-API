const { CompanyType } = require("../../../../database/database");

const companyTypeSubmitController = async (req, res) => {
  try {
    const data = req.body;
    const newCompany = await CompanyType.create({ ...data })
    return res.json({ ...newCompany })
  } catch(err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'POST',
  path: '/api/company-type/submit',
  handler: companyTypeSubmitController,
  requiresAuth: true,
  permissions: []
}