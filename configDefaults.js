const jwtSecret = "";
const allowRegister = false;
const sessionSecret = '';
const serverHost = '';
const drivePath = '';
const driveTempDir = '';

const dbInfo = {
  sequelizeConfig: {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
  },
  databaseName: '',
  id: '',
  passwd: ''
}

module.exports = {
  jwtSecret,
  allowRegister,
  dbInfo,
  sessionSecret,
  serverHost,
  drivePath,
  driveTempDir
}