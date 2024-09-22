const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Address', {
    unit_number: DataTypes.INTEGER,
    street_number: DataTypes.INTEGER,
    building_complex: DataTypes.TEXT,
    street_name: DataTypes.TEXT,
    suburb: DataTypes.TEXT,
    city_town: DataTypes.TEXT,
    state_province: DataTypes.TEXT,
    country: DataTypes.TEXT,
    postal_code: DataTypes.TEXT,
    formatted_address: DataTypes.TEXT,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
};