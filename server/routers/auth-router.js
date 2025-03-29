const { loginController, logoutController, refreshController } = require('../controllers');

const authRouter = require('express').Router();

authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);
authRouter.get('/refresh', refreshController);

module.exports = authRouter;