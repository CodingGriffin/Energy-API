const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hatronikadev', 'hatronika', 'y5i0!p0)pl83t9]', {
  host: 'hatronika-dev.clmsiig0qya9.eu-central-1.rds.amazonaws.com',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const User = require('../models/User')(sequelize);
const AccountVerification = require('../models/AccountVerification')(sequelize);
const Address = require('../models/Address')(sequelize);
const System = require('../models/System')(sequelize);
const Company = require('../models/Company')(sequelize);
const CompanyType = require('../models/CompanyType')(sequelize);
const StaffUser = require('../models/StaffUser')(sequelize);
const Role = require('../models/Role')(sequelize);

System.hasOne(Address);
Address.belongsTo(System);
User.hasMany(StaffUser);
StaffUser.belongsTo(User);
CompanyType.belongsTo(Company);
Company.hasMany(CompanyType);
CompanyType.hasMany(StaffUser);
StaffUser.belongsTo(CompanyType);
Role.hasMany(StaffUser);
StaffUser.belongsTo(Role);
User.hasMany(Company);
Company.belongsTo(User);
Address.hasOne(Company);
Company.belongsTo(Address);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync the models with the database
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

})();

module.exports = {
  sequelize,
  User,
  AccountVerification,
  Address,
  System,
  Role,
  StaffUser,
  Company,
  CompanyType
};