const {
  Sequelize
} = require('sequelize');

const {
  sequelize
} = require('./database');

async function getAllHexagonsByLocation(lat, lng, radius) {
  const res = await sequelize.query(`
    WITH polygons_in_radius AS (
      SELECT id, h3_index, status, geom 
      FROM dev.hexagons 
      WHERE ST_DWithin(
          geom, 
          ST_MakePoint(:lat, :lng)::geography, 
          :radius
      )
    )
    SELECT 
        p.id, h3_index, status,
        ST_X((ST_DumpPoints(p.geom)).geom) AS latitude,
        ST_Y((ST_DumpPoints(p.geom)).geom) AS longitude
    FROM 
        polygons_in_radius p;
  `, {
    replacements: {
      lat,
      lng,
      radius
    },
    type: Sequelize.QueryTypes.SELECT
  });

  return res;
}

async function getAllClaimedHexagons() {

  const res = await sequelize.query(` 
    WITH polygons_in_radius AS (
      SELECT id, h3_index, status, geom 
      FROM dev.hexagons 
      WHERE status IN ('claimed', 'reserved')
    )
    SELECT 
        p.id, h3_index, status,
        ST_X((ST_DumpPoints(p.geom)).geom) AS latitude,
        ST_Y((ST_DumpPoints(p.geom)).geom) AS longitude
    FROM 
        polygons_in_radius p;`, {
          type: Sequelize.QueryTypes.SELECT
        }
  );
  return res;
}

module.exports = {
  getAllHexagonsByLocation,
  getAllClaimedHexagons
};
