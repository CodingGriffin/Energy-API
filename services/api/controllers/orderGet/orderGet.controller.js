const { Op } = require("sequelize");
const { System } = require("../../../../database/database");
const pageSize = 4;

const orderGetController = async (req, res) => {
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    let showClosed = query.showclosed || true
    console.log(req.headers.vt1)
    console.log(req.headers.vt2)
    const whereClause = {};
    if (query.search) whereClause.formatted_address = { [Op.like]: `%${query.search}%` }
    if (query.status) whereClause.status = query.status
    if (showClosed == "false") whereClause.status = { [Op.in]: ['New', 'Follow Up', 'Quote Sent', 'Invoice Sent', 'Installation Pending'] }
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      attributes: ['id', 'formatted_address', 'monthly_consumption_kwh', 'total_panels', 'total_ems', 'updatedAt', 'status', 'system_cost_incl'],
    })
      .then(systemsWithMode => {
        const totalPages = Math.ceil(systemsWithMode.count / pageSize);
        const systems = systemsWithMode.rows.map(sys => {
          let result = sys.dataValues
          return result
        }).sort((a, b) => a.id - b.id)
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
  path: '/api/order',
  handler: orderGetController,
  requiresAuth: false,
  permissions: []
};