const db = require('./db');
const sequelize = require('sequelize');

const User = db.define('users', {
  userid: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: sequelize.STRING, allowNull: false, unique: true },
  password: { type: sequelize.STRING, allowNull: false },
  valid_code: { type: sequelize.INTEGER, allowNull: false }
});

User.sync();

module.exports = User;
