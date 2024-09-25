const { User, CompanyType, Company } = require("../../../../database/database");
const { StaffUser } = require("../../../../database/database");

const viewTypeGetController = async (req, res) => {
  console.log(req.headers["vt"])
  console.log(req.headers['authorization'])
  try {
    const userId = req.user.id;
    const classes = {
      admin: "Admin",
      serviceCenter: "Service Center",
      systemOwner: "System Owner",
      roofOwner: "Roof Owner"
    }
    User.findOne({
      where: { id: userId },
      include: [
        {
          model: StaffUser,
          include: [
            {
              model: CompanyType
            }
          ]
        }
      ]
    }).then(user => {
      user = user.get({ plain: true })
      Company.findAll({
        attributes: ['id', 'name', 'logo'],
      })
        .then(companies => {
          companies = companies.map(cp => cp.dataValues)
          const data = user.StaffUsers.reduce((ct, su) => {
            if (!su.CompanyType || !su.CompanyType.CompanyId)
              return ct;
            ct[su.CompanyType.type] = [...ct[su.CompanyType.type], companies.filter(cp => su.CompanyType.CompanyId == cp.id)[0]]
            return ct
          }, {
            serviceCenter: [],
            systemOwner: [],
            roofOwner: [],
            admin: [],
          })

          let availableViewStates = []
          for (key in data) {
            availableViewStates = [
              ...availableViewStates,
              {
                "type": classes[key],
                companies: data[key]
              }
            ]
          }
          res.json({
            userId,
            availableViewStates
          })
        })
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  method: 'GET',
  path: '/api/view-type',
  handler: viewTypeGetController,
  requiresAuth: true,
  permissions: []
}