const { CompanyType } = require("../../../../database/database");

const companyTypeSubmitController = async (req, res) => {
  try {
    const data = req.body;
    const newCompanyType = await CompanyType.create({ ...data })
    return res.json({ ...newCompanyType })
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