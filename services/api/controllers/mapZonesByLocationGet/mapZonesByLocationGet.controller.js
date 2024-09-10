const {
  getAllHexagonsByLocation
} = require('../../../../database/dbMap')

const mapZonesByLocationGetController = async (req, res) => {

  try {
    const hexs = await getAllHexagonsByLocation(req.query.lat, req.query.lng, 100000) || [];

    const hexagons = {};

    for (const hex of hexs) {

      if (!hexagons[hex.id]) {

        hexagons[hex.id] = {
          id: hex.id,
          h3_index: hex.h3_index,
          status: hex.status,
          paths: [{
            lat: hex.latitude,
            lng: hex.longitude
          }]
        }

        continue;
      }

      hexagons[hex.id].paths.push({
        lat: hex.latitude,
        lng: hex.longitude
      });
    }

    res.json(Object.values(hexagons) || []);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'GET',
  path: '/api/map/get-zones-by-location',
  handler: mapZonesByLocationGetController,
  requiresAuth: false,
  permissions: []
};