const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AccountVerification', {
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    otp_code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    guid: DataTypes.TEXT,
    resend_count: DataTypes.INTEGER,
    retry_count: DataTypes.INTEGER,
    expiration_time: DataTypes.DATE,
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