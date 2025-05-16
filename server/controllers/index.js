// auth controllers
const loginController = require('./auth/loginController');
const logoutController = require('./auth/logoutController');
const refreshController = require('./auth/refreshController');
const { sendResetPasswordCode, forgotPassword } = require('./auth/forgotPasswordController');
const { getUserByEmail, createUsers, getCompletedKPIs, getKPIInfo, addAdmin } = require('./users/getController');
const { getResponse, updateResponse } = require('./users/responseController');

module.exports = {
  loginController,
  logoutController,
  refreshController,
  getUserByEmail,
  getResponse,
  updateResponse,
  sendResetPasswordCode,
  forgotPassword,
  createUsers,
  getCompletedKPIs,
  getKPIInfo,
  addAdmin,
};