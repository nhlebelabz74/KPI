// auth controllers
const loginController = require('./auth/loginController');
const logoutController = require('./auth/logoutController');
const refreshController = require('./auth/refreshController');
const { getUserByEmail } = require('./users/getController');

module.exports = {
  loginController,
  logoutController,
  refreshController,
  getUserByEmail,
};