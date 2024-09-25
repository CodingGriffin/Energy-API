const { System } = require("../../../../database/database");
const pageSize = 10;

const systemWithoutZone = (param) => {
  let sys = param;
  sys.income = sys.monthly_consumption_kwh * sys.unit_cost_new
  delete sys.zone_id
  return sys
}

const systemByZoneGetController = async (req, res) => {
  const stateClasses = {
    "Live": "Healthy",
    "Installation Pending": "Healthy",
    "Error": "Error",
    "Warning": "Warning"
  }
  try {
    const query = req.query;
    const page = parseInt(query.page) || 1;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    System.findAll({
      attributes: ['id', 'state', 'monthly_consumption_kwh', 'unit_cost_new', 'formatted_address', 'zone_id', 'updatedAt']
    })
      .then(systemsWithMode => {
        const systems = systemsWithMode.map(sys => ({ ...sys.dataValues }))
        let result = systems.reduce((res, sys) => {
          let index = res.findIndex(el => el.zone_id === sys.zone_id)
          if (index < 0) {
            res = [
              ...res,
              {
                zone_id: sys.zone_id,
                Systems: 1,
                ...{
                  Healthy: 0,
                  Warning: 0,
                  Error: 0,
                  [stateClasses[sys.state]]: 1,
                },
                "Monthly Consumption": sys.monthly_consumption_kwh,
                "Monthly Revenue": sys.monthly_consumption_kwh * sys.unit_cost_new,
                system_entities: [
                  systemWithoutZone(sys)
                ]
              }
            ]
          } else {
            res[index] = { 
              ...res[index],
              Systems: res[index].Systems + 1,
              [stateClasses[sys.state]]: res[index][stateClasses[sys.state]] + 1,
              "Monthly Consumption": res[index]["Monthly Consumption"] + sys.monthly_consumption_kwh,
              "Monthly Revenue": res[index]["Monthly Consumption"] + sys.monthly_consumption_kwh * sys.unit_cost_new,
              system_entities: [...res[index].system_entities, systemWithoutZone(sys)] }
          }
          return res;
        }, []).sort((a, b) => a.zone_id - b.zone_id)
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
  path: '/api/zone/index',
  handler: systemByZoneGetController,
  requiresAuth: false,
  permissions: []
};