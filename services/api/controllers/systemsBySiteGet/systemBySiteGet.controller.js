const { Op, where } = require("sequelize");
const { System, Address } = require("../../../../database/database");
const pageSize = 10;

const systemWithoutAddress = (param) => {
  let sys = param;
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
    // console.log(query)
    const page = parseInt(query.page) || 1;
    const whereClause = {};
    // console.log(whereClause)
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAll({
      include: Address
    })
      .then(systemsWithMode => {
        const systems = systemsWithMode.map(sys => ({ ...sys.dataValues, Address: sys.dataValues.Address.dataValues }))
        console.log(systems)
        const result = systems.reduce((res, sys) => {
          let index = res.findIndex(el => el.AddressId === sys.AddressId)
          console.log(index)
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
          console.log(res)
          return res;
        }, [])
        // console.log(result)
        res.json(result)
      })
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'GET',
  path: '/api/site/system',
  handler: systemBySiteGetController,
  requiresAuth: false,
  permissions: []
};