const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('StaffUser', {
    // rold_id: {
    //   type: DataTypes.INTEGER,
    // },
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