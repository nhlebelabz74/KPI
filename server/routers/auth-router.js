const { loginController, logoutController, refreshController, sendResetPasswordCode, forgotPassword } = require('../controllers');

const authRouter = require('express').Router();

authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/refresh', refreshController);

authRouter.post('/send-reset-password-code', sendResetPasswordCode);
authRouter.post('/reset-password', forgotPassword);

module.exports = authRouter;