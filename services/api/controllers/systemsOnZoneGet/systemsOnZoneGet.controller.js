const { Op } = require("sequelize");
const { System } = require("../../../../database/database");
const pageSize = 5;

const systemOnZoneGetController = async (req, res) => {
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const whereClause = {};
    if (query.search) whereClause.formatted_address = { [Op.like]: `%${query.search}%` }
    if (query.status) whereClause.state = query.status
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: ['id', 'formatted_address', 'monthly_consumption_kwh', 'total_panels', 'total_ems', 'updatedAt', 'state', 'unit_cost_new'],
    })
      .then(systemsWithMode => {
        const totalPages = Math.ceil(systemsWithMode.count / pageSize);
        const systems = systemsWithMode.rows.map(sys => {
          let result = sys.dataValues
          result.income = sys.monthly_consumption_kwh * sys.unit_cost_new
          delete result.unit_cost_new
          return result
        })
        res.json({
          data: systems,
          meta: {
            totalItems: systemsWithMode.count,
            totalPages,
            currentPage: page,
            pageSize: pageSize,
          }
        })
      })
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'GET',
  path: '/api/zone/system',
  handler: systemOnZoneGetController,
  requiresAuth: false,
  permissions: []
};