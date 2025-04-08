// auth controllers
const loginController = require('./auth/loginController');
const logoutController = require('./auth/logoutController');
const refreshController = require('./auth/refreshController');
const { getUserByEmail } = require('./users/getController');
const { getResponse, updateResponse } = require('./users/responseController');

module.exports = {
  loginController,
  logoutController,
  refreshController,
  getUserByEmail,
  getResponse,
  updateResponse,
};