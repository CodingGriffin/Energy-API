const { System } = require("../../../../database/database");
const pageSize = 10;

const systemWithoutZone = (param) => {
  let sys = param;
  delete sys.zone_id
  return sys
}

const systemByZoneGetController = async (req, res) => {
  try {
    const query = req.query;
    // console.log(query)
    const page = parseInt(query.page) || 1;
    const whereClause = {};
    // console.log(whereClause)
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAll()
      .then(systemsWithMode => {
        const systems = systemsWithMode.map(sys => ({ ...sys.dataValues }))
        const result = systems.reduce((res, sys) => {
          let index = res.findIndex(el => el.zone_id === sys.zone_id)
          if (index < 0) {
            res = [
              ...res,
              {
                zone_id: sys.zone_id,
                systems: [
                  systemWithoutZone(sys)
                ]
              }
            ]
          } else {
            res[index] = { ...res[index], systems: [...res[index].systems, systemWithoutZone(sys)] }
          }
          return res;
        }, []).sort((a, b) => a.zone_id - b.zone_id)
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
  path: '/api/zone/system',
  handler: systemByZoneGetController,
  requiresAuth: false,
  permissions: []
};