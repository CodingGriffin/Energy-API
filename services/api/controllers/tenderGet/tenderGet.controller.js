const { Op, where } = require("sequelize");
const { System } = require("../../../../database/database");
const pageSize = 10;

const tenderGetController = async (req, res) => {
  try {
    const query = req.query;
    console.log(query)
    const page = parseInt(query.page) || 1;
    const systemId = query.systemId;
    const formatted_address = query.formatted_address;
    const less = ["less_lcoe", "less_panel", "less_roi", "less_irr", "less_cost", "less_income", "less_consumption"];
    const more = ["more_lcoe", "more_panel", "more_roi", "more_irr", "more_cost", "more_income", "more_consumption"];
    const val = ["lcoe", "total_panel", "roi", "irr", "system_cost_incl", "system_cost_excl", "monthly_consumption_kwh"]
    const whereClause = {};
    if (systemId) whereClause.id = systemId;
    if (formatted_address) whereClause.formatted_address = { [Op.like]: `%${formatted_address}%`}
    less.forEach((le, index) => {
      if (query[le]) whereClause[val[index]] = { [Op.lt]: parseFloat(query[le]) }
    });
    more.forEach((me, index) => {
      if (query[me]) whereClause[val[index]] = { [Op.gt]: parseFloat(query[me]) }
    })
    console.log(whereClause)
    const limit = pageSize;
    const offset = (page - 1) * pageSize;


    const systems = await System.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset
    });
    const totalPages = Math.ceil(systems.count / pageSize);

    return res.json({
      data: systems.rows,
      meta: {
        totalItems: systems.count,
        totalPages: totalPages,
        currentPage: page,
        pageSize: pageSize,
      },
    });
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