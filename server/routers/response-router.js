const { getResponse, updateResponse, nudgeUser, requestPeerDocument, requestSupervisorDocument, saveAppraisal, loadAppraisalAnswers, evaluateAppraisal, getAppraisalStatus } = require('../controllers');

const responseRouter = require('express').Router();

responseRouter.post('/update/response', updateResponse);
responseRouter.get('/get/response/:email/:kpiNumber', getResponse);
responseRouter.post('/nudge', nudgeUser);
responseRouter.post('/request/peer/document', requestPeerDocument);
responseRouter.post('/request/super/document', requestSupervisorDocument);

responseRouter.post('/appraisal/save', saveAppraisal);
responseRouter.get('/appraisal/get-response/:email/:sectionId/:appraisalPeriod', loadAppraisalAnswers);
responseRouter.post('/appraisal/evaluate', evaluateAppraisal);
responseRouter.get('/appraisal/status/:email/:appraisalPeriod', getAppraisalStatus);

module.exports = responseRouter;