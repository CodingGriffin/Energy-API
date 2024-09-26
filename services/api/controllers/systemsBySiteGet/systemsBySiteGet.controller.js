const { Op } = require("sequelize");
const { System, Address } = require("../../../../database/database");
const pageSize = 10;

const systemWithoutAddress = (param) => {
  let sys = param;
  sys.income = sys.monthly_consumption_kwh * sys.unit_cost_new
  delete sys.AddressId
  delete sys.Address
  return sys
}
const changeKeyId2AddressId = (sys) => {
  let res = { ...sys.Address, AddressId: sys.AddressId };
  delete res.id
  res.systems = [systemWithoutAddress(sys)]
  return res
}

const systemBySiteGetController = async (req, res) => {
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const whereClause = {};
    if (query.search) whereClause.formatted_address = { [Op.like]: `%${query.search}%` }
    if (query.status) whereClause.state = query.status
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAll({
      where: whereClause,
      attributes: ['id', 'AddressId', 'formatted_address', 'monthly_consumption_kwh', 'total_panels', 'total_ems', 'updatedAt', 'state', 'unit_cost_new'],
      include: {
        model: Address,
        attributes: ['id', 'formatted_address']
      },
    })
      .then(systemsWithMode => {
        const systems = systemsWithMode.map(sys => ({ ...sys.dataValues, Address: sys.dataValues.Address.dataValues }))
        let result = systems.reduce((res, sys) => {
          let index = res.findIndex(el => el.AddressId === sys.AddressId)
          if (index < 0) {
            res = [
              ...res,
              changeKeyId2AddressId(sys)
            ]
          } else {
            res[index] = {
              ...res[index],
              systems: [
                ...res[index].systems,
                systemWithoutAddress(sys)
              ]
            }
          }
          return res;
        }, [])
        const totalItems = result.length
        const totalPages = Math.ceil(totalItems / pageSize)
        result = result.slice(offset, offset + limit)
        res.json({
          data: result,
          meta: {
            totalItems,
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
  path: '/api/zone/site',
  handler: systemBySiteGetController,
  requiresAuth: false,
  permissions: []
};