const positions = {
  CA: "CA", // Candidate Attorney
  ASSOCIATE: "ASSOCIATE", // Associate
  SA: "SA", // Senior Associate
  SDP: "SDP", // Salaried Director and Partner
  EDP: "EDP" // Equity Director and Partner
}

const KPI_Types = {
  PROFITABILITY: "PROFITABILITY",
  LEADERSHIP: "LEADERSHIP",
  KNOWLEDGE_MANAGEMENT: "KNOWLEDGE MANAGEMENT",
  TEAMWORK: "TEAMWORK",
  FIRM_DEVELOPMENT: "FIRM DEVELOPMENT",
  TECHNICAL_SKILLS: "TECHNICAL SKILLS",
  BUSINESS_DEVELOPMENT: "BUSINESS DEVELOPMENT"
}

const ResetPasswordEmailHTML = ({ code }) => (
  `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        /* Base styles */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #1C2624;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #FC127D;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px 25px;
        }
        .content p {
          margin: 0 0 20px;
          color: #1C2624;
        }
        .verification-code {
          background-color: #DBDAAC;
          border: 1px solid #AEB8A0;
          border-radius: 8px;
          padding: 15px;
          margin: 25px 0;
          text-align: center;
        }
        .code {
          font-family: monospace;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #1C2624;
        }
        .instructions {
          background-color: #F7F7F7;
          border-left: 4px solid #8FB7CE;
          padding: 15px;
          margin: 25px 0;
        }
        .button {
          display: inline-block;
          background-color: #FC127D;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          margin: 15px 0;
        }
        .button:hover {
          background-color: #e01171;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #7C929F;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background-color: #AEB8A0;
          margin: 30px 0;
          opacity: 0.3;
        }
        .help-text {
          font-size: 14px;
          color: #7C929F;
        }
        @media only screen and (max-width: 480px) {
          .wrapper {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 3px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="email-container">
          <div class="header">
            <!-- Replace with your logo if available -->
            <img src="cid:company-logo" alt="Company Logo" class="logo">
          </div>
          
          <div class="content">
            <p>Hello,</p>
            
            <p>We received a request to reset your password. Use the verification code below to complete the process:</p>
            
            <div class="verification-code">
              <div class="code">${code}</div>
            </div>
            
            <p>Enter this code in the password reset form to verify your identity. Then you'll be able to create a new password.</p>
            
            <div class="divider"></div>
            
            <div class="instructions">
              <p><strong>Important:</strong> This code will expire in 30 minutes for security reasons.</p>
              <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email contains confidential information and may also be legally privileged. The information contained in this email is only for the use of the intended recipient. If you are not the intended recipient, any disclosure, copying and/or distribution of the content of this email is strictly prohibited. Should you have received this email in error, please notify us immediately by return email and delete this email from your systems. LNP Beyond Legal shall not be liable for any unauthorised use of, or reliance on this email or any attachment.</p>
            
            <p>Questions? Email us at <a href="mailto:edp3@lnpbeyondlegal.com" style="color: #FC127D;">edp3@lnpbeyondlegal.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
);

const documentRequestEmailHTML = ({ requestorName, type, description }) => (
  `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Request Notification</title>
      <style>
        /* Base styles */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #1C2624;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #FC127D;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px 25px;
        }
        .content p {
          margin: 0 0 20px;
          color: #1C2624;
        }
        .document-request {
          background-color: #DBDAAC;
          border: 1px solid #AEB8A0;
          border-radius: 8px;
          padding: 15px;
          margin: 25px 0;
          text-align: center;
        }
        .document-name {
          font-family: sans-serif;
          font-size: 22px;
          font-weight: bold;
          color: #1C2624;
        }
        .request-details {
          background-color: #F7F7F7;
          border-left: 4px solid #8FB7CE;
          padding: 15px;
          margin: 25px 0;
        }
        .buttons-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #FC127D;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          margin: 5px 10px;
        }
        .button.secondary {
          background-color: #7C929F;
        }
        .button:hover {
          background-color: #e01171;
        }
        .button.secondary:hover {
          background-color: #6b8090;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #7C929F;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background-color: #AEB8A0;
          margin: 30px 0;
          opacity: 0.3;
        }
        .help-text {
          font-size: 14px;
          color: #7C929F;
        }
        @media only screen and (max-width: 480px) {
          .wrapper {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .document-name {
            font-size: 20px;
          }
          .buttons-container {
            display: flex;
            flex-direction: column;
          }
          .button {
            margin: 5px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="email-container">
          <div class="header">
            <img src="cid:company-logo" alt="Company Logo" class="logo">
          </div>
          
          <div class="content">
            <p>Hello Supervisor/Peer,</p>
            
            <p><strong>${requestorName}</strong> has requested a document for the following KPI:</p>
            
            <div class="document-request">
              <div class="document-name">${type}</div>
              <div class="urgency-tag">${description}</div>
            </div>
            
            <div class="request-details">
              <p><strong>Reason for Request:</strong></p>
              <p>Supervisor/Peer assessment required</p>
            </div>
            
            <p>Please review this request and take appropriate action at your earliest convenience.</p>
            
            <div class="divider"></div>
            
            <p class="help-text">If you need more information before making a decision, you can directly contact the requestor for clarification.</p>
          </div>
          
          <div class="footer">
            <p>This email contains confidential information and may also be legally privileged. The information contained in this email is only for the use of the intended recipient. If you are not the intended recipient, any disclosure, copying and/or distribution of the content of this email is strictly prohibited. Should you have received this email in error, please notify us immediately by return email and delete this email from your systems. LNP Beyond Legal shall not be liable for any unauthorised use of, or reliance on this email or any attachment.</p>
            
            <p>Questions? Email us at <a href="mailto:edp3@lnpbeyondlegal.com" style="color: #FC127D;">edp3@lnpbeyondlegal.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
);

const NudgeEmailHTML = ({ fullname, supervisorName, kpiName, kpiProgress }) => (
  `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>KPI Progress Reminder</title>
      <style>
        /* Base styles */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #1C2624;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-container {
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #FC127D;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .content {
          padding: 30px 25px;
        }
        .content p {
          margin: 0 0 20px;
          color: #1C2624;
        }
        .kpi-progress {
          background-color: #DBDAAC;
          border: 1px solid #AEB8A0;
          border-radius: 8px;
          padding: 15px;
          margin: 25px 0;
          text-align: center;
        }
        .progress {
          font-family: monospace;
          font-size: 28px;
          font-weight: bold;
          color: #1C2624;
        }
        .alert-message {
          background-color: #F7F7F7;
          border-left: 4px solid #FC127D;
          padding: 15px;
          margin: 25px 0;
        }
        .button {
          display: inline-block;
          background-color: #FC127D;
          color: #ffffff;
          text-decoration: none;
          padding: 12px 30px;
          border-radius: 6px;
          font-weight: 600;
          margin: 15px 0;
        }
        .button:hover {
          background-color: #e01171;
        }
        .footer {
          background-color: #f1f1f1;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #7C929F;
        }
        .footer p {
          margin: 5px 0;
        }
        .divider {
          height: 1px;
          background-color: #AEB8A0;
          margin: 30px 0;
          opacity: 0.3;
        }
        .help-text {
          font-size: 14px;
          color: #7C929F;
        }
        @media only screen and (max-width: 480px) {
          .wrapper {
            padding: 10px;
          }
          .content {
            padding: 20px 15px;
          }
          .progress {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="email-container">
          <div class="header">
            <img src="cid:company-logo" alt="Company Logo" class="logo">
          </div>
          
          <div class="content">
            <p>Hello ${fullname},</p>
            
            <p><strong>${supervisorName}</strong>, has noticed that your progress for the <strong>${kpiName}</strong> KPI is currently at:</p>
            
            <div class="kpi-progress">
              <div class="progress">${kpiProgress}%</div>
            </div>
            
            <div class="alert-message">
              <p><strong>Attention Required:</strong> Your supervisor is requesting that you improve these numbers as soon as possible!</p>
            </div>
            
            <p>Please prioritize activities that will help you reach your targets and update your progress in the system.</p>
            
            <div class="divider"></div>
            
            <p class="help-text">If you need any assistance or have questions about your targets, please contact your supervisor directly.</p>
          </div>
          
          <div class="footer">
            <p>This email contains confidential information and may also be legally privileged. The information contained in this email is only for the use of the intended recipient. If you are not the intended recipient, any disclosure, copying and/or distribution of the content of this email is strictly prohibited. Should you have received this email in error, please notify us immediately by return email and delete this email from your systems. LNP Beyond Legal shall not be liable for any unauthorised use of, or reliance on this email or any attachment.</p>
            
            <p>Questions? Email us at <a href="mailto:edp3@lnpbeyondlegal.com" style="color: #FC127D;">edp3@lnpbeyondlegal.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
);

module.exports = {
  positions,
  KPI_Types,
  ResetPasswordEmailHTML,
  NudgeEmailHTML,
  documentRequestEmailHTML
}