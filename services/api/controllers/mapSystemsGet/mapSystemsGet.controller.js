const {
  getAllClaimedHexagons
} = require('../../../../database/dbMap')

const mapSystemsGetController = async (req, res) => {

  try {
    const hexs = await getAllClaimedHexagons() || [];

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

    res.json({
      systemPoints: [
        {
          "lat": -26.2041 + (Math.random() - 0.5) * 2,
          "lng": 28.0473 + (Math.random() - 0.5) * 2,
          "status": "Pending Approval",
          "state": "pending",
          "identifier": 12345
        },
        {
          "lat": -26.2045 + (Math.random() - 0.5) * 2,
          "lng": 28.0480 + (Math.random() - 0.5) * 2,
          "status": "Pending Installation",
          "state": "pending",
          "identifier": 23456
        },
        {
          "lat": -26.2050 + (Math.random() - 0.5) * 2,
          "lng": 28.0490 + (Math.random() - 0.5) * 2,
          "status": "Live",
          "state": "live",
          "identifier": 34567
        },
        {
          "lat": -26.2055 + (Math.random() - 0.5) * 2,
          "lng": 28.0500 + (Math.random() - 0.5) * 2,
          "status": "Pending Installation",
          "state": "alarm",
          "identifier": 45678
        },
        {
          "lat": -26.2060 + (Math.random() - 0.5) * 2,
          "lng": 28.0510 + (Math.random() - 0.5) * 2,
          "status": "Live",
          "state": "live",
          "identifier": 56789
        }
      ],
      serviceCentres: Object.values(hexagons) || []
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  method: 'GET',
  path: '/api/map/get-systems',
  handler: mapSystemsGetController,
  requiresAuth: false,
  permissions: []
};