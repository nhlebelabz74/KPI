// auth controllers
const loginController = require('./auth/loginController');
const logoutController = require('./auth/logoutController');
const refreshController = require('./auth/refreshController');

module.exports = {
  loginController,
  logoutController,
  refreshController,
};