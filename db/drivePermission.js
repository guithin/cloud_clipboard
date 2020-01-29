const db = require('./db');
const sequelize = require('sequelize');

const accessByUser = db.define('accessByUser', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  userid: { type: sequelize.INTEGER, allowNull: false },
  permissionCode: { type: sequelize.STRING, allowNull: false },
  permissionPath: { type: sequelize.STRING, allowNull: false },
  validCode: { type: sequelize.TINYINT, allowNull: false }
});

const accessGroup = db.define('accessGroup', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  groupTitle: { type: sequelize.STRING, allowNull: false },
  validCode: { type: sequelize.TINYINT, allowNull: false }
});

const groupMember = db.define('groupMember', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  userid: { type: sequelize.INTEGER, allowNull: false },
  groupId: { type: sequelize.INTEGER, allowNull: false },
  validCode: { type: sequelize.TINYINT, allowNull: false }
});

const accessByGroup = db.define('accessByGroup', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  groupId: { type: sequelize.INTEGER, allowNull: false },
  permissionCode: { type: sequelize.STRING, allowNull: false },
  permissionPath: { type: sequelize.STRING, allowNull: false },
  validCode: { type: sequelize.TINYINT, allowNull: false }
});

const accessByToken = db.define('accessByToken', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  permissionPath: { type: sequelize.STRING, allowNull: false },
  token: { type: sequelize.STRING, allowNull: false },
  validCode: { type: sequelize.TINYINT, allowNull: false }
});

accessByUser.sync();
accessGroup.sync();
groupMember.sync();
accessByGroup.sync();
accessByToken.sync();

module.exports = {
  accessByUser,
  accessGroup, groupMember, accessByGroup,
  accessByToken
};
