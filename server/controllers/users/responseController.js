const { asyncWrapper } = require('../../middleware');
const { User, Response, Appraisal } = require('../../models');
const { AES } = require('crypto-js');
const CryptoJS = require('crypto-js');
const sendEmail = require('../../utils/send-email');
const { NudgeEmailHTML, documentRequestEmailHTML, KPI_Types: types } = require('../../constants');

const path = require('path');
const logoPath = path.join(__dirname, '../../assets/logo-dark.png');

// endpoint: /users/update/response
const updateResponse = asyncWrapper(async (req, res) => {
  const { email, kpiNumber, question, type, answer, documents, documents_metadata } = req.body;

  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
  if (!decryptedEmail) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Find the user by email
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // check that type is valid
  if (!Object.values(types).includes(type)) {
    return res.status(400).json({ message: 'Invalid KPI type' });
  }

  // check if answer and question are present
  if (!answer || !question) {
    return res.status(400).json({ message: 'Answer and question are required' });
  }

  // find the response by kpiNumber and email
  const response = await Response.findOne({ kpiNumber: kpiNumber, email: decryptedEmail });

  // create response if it doesn't exist
  if (!response) {
    await Response.create({
      kpiNumber: kpiNumber,
      email: decryptedEmail,
      question: question,
      kpiType: type,
      answer: answer,
      documents: documents,
      documents_metadata: documents_metadata,
    });
  }
  else {
    // update response if it exists
    response.answer = answer; // an object
    response.documents = documents; // only docs and answer are updated since the question can'won't ever change
    response.documents_metadata = documents_metadata;
    await response.save();
  }

  res.status(200).json({ message: 'Response updated successfully' });
});

// endpoint: /users/get/response/:email/:kpiNumber
const getResponse = asyncWrapper(async (req, res) => {
  const { email, kpiNumber } = req.params;

  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
  if (!decryptedEmail) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  // Find the user by email
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // find the response by kpiNumber and email
  const response = await Response.findOne({ kpiNumber: decodeURIComponent(kpiNumber), email: decryptedEmail });
  console.log("response: ", response);
  if (!response) {
    return res.status(404).json({ message: 'Response not found' });
  }

  res.status(200).json({ message: 'Response found', response: response });
});

// nudge the user to update their response if they haven't already
// endpoint: /users/nudge
const nudgeUser = asyncWrapper(async (req, res) => {
  const { from, to, kpiName, kpiProgress } = req.body;
   
  // Find the user by email
  const user = await User.findOne({ email: to });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // find the supervisor by email
  const supervisor = await User.findOne({ email: from });
  if (!supervisor) {
    return res.status(404).json({ message: 'Supervisor not found' });
  }

  // send an email to the user (the "to" email)
  const response = await sendEmail({
    receiver_email: to,
    subject: `[URGENT] KPI Progress Nudge: ${kpiName} KPI`,
    html: NudgeEmailHTML({ fullname: `${user.name} ${user.surname}`, supervisorName: `${supervisor.name} ${supervisor.surname}`, kpiName: kpiName, kpiProgress: kpiProgress }),
    attachments: [
      {
        filename: 'logo-dark.png',
        path: logoPath,
        cid: 'company-logo' 
      }
    ]
  });

  res.status(200).json({ message: 'Nudge sent', response: response });
});

// request document from supervisor
// endpoint: /users/request/super/document
const requestSupervisorDocument = asyncWrapper(async (req, res) => {
  const { email, type } = req.body;
  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

  // find the user
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const supervisor = user.supervisor.length > 1 ? user.supervisor : user.supervisor[0];
  const description = types.LEADERSHIP === type ? "Assess demonstration of leadership skills and characteristics" : "Assess teamwork and collaboration skills";

  // send an email to the supervisor
  await sendEmail({
    receiver_email: supervisor,
    subject: `Request for ${type} document`,
    html: documentRequestEmailHTML({ requestorName: `${user.name} ${user.surname}`, type: type, description: description }),
    attachments: [
      {
        filename: 'logo-dark.png',
        path: logoPath,
        cid: 'company-logo' 
      }
    ]
  });

  res.status(200).json({ message: 'Request sent' });
});

// request document from peer
// endpoint: /users/request/peer/document
const requestPeerDocument = asyncWrapper(async (req, res) => {
  const { to, from, type } = req.body;
  // decrypt the email using AES
  const decryptedEmail = AES.decrypt(decodeURIComponent(from), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

  // find the user
  const user = await User.findOne({ email: decryptedEmail });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const peer = await User.findOne({ email: decodeURIComponent(to) });
  const description = types.LEADERSHIP === type ? "Assess demonstration of leadership skills and characteristics" : "Assess teamwork and collaboration skills";

  // send an email to the peer
  await sendEmail({
    receiver_email: peer.email,
    subject: `Request for ${type} document`,
    html: documentRequestEmailHTML({ requestorName: `${user.name} ${user.surname}`, type: type, description: description }),
    attachments: [
      {
        filename: 'logo-dark.png',
        path: logoPath,
        cid: 'company-logo' 
      }
    ]
  });

  res.status(200).json({ message: 'Request sent' });
});

// save appraisal stuff
// endpoint: appraisal/save
const saveAppraisal = asyncWrapper(async (req, res) => {
  const { email, sectionId, answers, appraisalPeriod } = req.body;
  
  try {
    const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    // get userId using email
    const user = await User.findOne({ email: decryptedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get appraisal by userId and appraisalPeriod
    let appraisal = await Appraisal.findOne({ userId: user._id, appraisalPeriod: appraisalPeriod });
    
    if (!appraisal) {
      // create a new appraisal if it doesn't exist
      appraisal = await Appraisal.create({
        userId: user._id,
        appraisalPeriod: appraisalPeriod,
        answers: [{ sectionId: sectionId, answers: answers }]
      });
    } else {
      // Check if section already exists
      const existingSectionIndex = appraisal.answers.findIndex(answer => answer.sectionId === sectionId);
      
      if (existingSectionIndex !== -1) {
        // Update existing section
        appraisal.answers[existingSectionIndex].answers = answers;
      } else {
        // Add new section
        appraisal.answers.push({ sectionId: sectionId, answers: answers });
      }
      
      await appraisal.save();
    }

    res.status(200).json({ message: 'Appraisal saved successfully' });
  } catch (error) {
    console.error('Error saving appraisal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// load the answers
// endpoint: appraisal/get-response/:email/:sectionId/:appraisalPeriod
const loadAppraisalAnswers = asyncWrapper(async (req, res) => {
  const { email, sectionId, appraisalPeriod } = req.params;
  
  try {
    const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    // get userId using email
    const user = await User.findOne({ email: decryptedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get appraisal by userId and appraisalPeriod
    const appraisal = await Appraisal.findOne({ 
      userId: user._id, 
      appraisalPeriod: decodeURIComponent(appraisalPeriod) 
    });

    if (!appraisal) {
      return res.status(200).json({ 
        message: 'No appraisal found for this period',
        answers: []
      });
    }

    // Find the specific section
    const sectionData = appraisal.answers.find(answer => answer.sectionId === sectionId);
    
    if (!sectionData) {
      return res.status(200).json({ 
        message: 'No answers found for this section',
        answers: []
      });
    }

    res.status(200).json({ 
      message: 'Answers loaded successfully',
      answers: sectionData.answers
    });
  } catch (error) {
    console.error('Error loading appraisal answers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// evaluate appraisal
// endpoint: appraisal/evaluate
const evaluateAppraisal = asyncWrapper(async (req, res) => {
  const { email, appraisalPeriod, evaluated } = req.body;
  
  try {
    const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    // get the user by email
    const user = await User.findOne({ email: decryptedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get the appraisal by userId and appraisalPeriod
    const appraisal = await Appraisal.findOne({ 
      userId: user._id, 
      appraisalPeriod: appraisalPeriod 
    });
    
    if (!appraisal) {
      return res.status(404).json({ message: 'Appraisal not found' });
    }

    // update the appraisal to evaluated
    appraisal.evaluated = evaluated;
    await appraisal.save();

    res.status(200).json({ message: 'Appraisal evaluated successfully' });
  } catch (error) {
    console.error('Error evaluating appraisal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get appraisal status (to check if evaluated)
// endpoint: appraisal/status/:email/:appraisalPeriod
const getAppraisalStatus = asyncWrapper(async (req, res) => {
  const { email, appraisalPeriod } = req.params;
  
  try {
    const decryptedEmail = AES.decrypt(decodeURIComponent(email), process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    // get userId using email
    const user = await User.findOne({ email: decryptedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // get appraisal by userId and appraisalPeriod
    const appraisal = await Appraisal.findOne({ 
      userId: user._id, 
      appraisalPeriod: decodeURIComponent(appraisalPeriod) 
    });

    if (!appraisal) {
      return res.status(200).json({ 
        message: 'No appraisal found for this period',
        evaluated: false,
        exists: false
      });
    }

    res.status(200).json({
      message: 'Appraisal status retrieved successfully',
      evaluated: appraisal.evaluated,
      exists: true,
      sectionsCount: appraisal.answers.length
    });
  } catch (error) {
    console.error('Error getting appraisal status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = {
  updateResponse,
  getResponse,
  nudgeUser,
  requestSupervisorDocument,
  requestPeerDocument,
  saveAppraisal,
  loadAppraisalAnswers,
  evaluateAppraisal,
  getAppraisalStatus
};