const Sequelize = require('sequelize');
const { dbInfo } = require('../config');

const sequelize = new Sequelize(dbInfo.databaseName, dbInfo.id, dbInfo.passwd, dbInfo.sequelizeConfig);

module.exports = sequelize;
