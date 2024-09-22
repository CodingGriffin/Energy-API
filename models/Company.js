const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Company', {
    name: {
      type: DataTypes.TEXT,
    },
    logo: {
      type: DataTypes.TEXT,
    },
    phone: DataTypes.TEXT,
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
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