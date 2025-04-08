const { getResponse, updateResponse } = require('../controllers');

const responseRouter = require('express').Router();

responseRouter.post('/update/response', updateResponse);
responseRouter.get('/get/response/:email/:kpiNumber', getResponse);

module.exports = responseRouter;