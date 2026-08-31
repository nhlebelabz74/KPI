const axios = require('axios');
require('dotenv').config();

const sendEmail = async ({ receiver_email, subject, html }) => {
    try {
      const api = axios.create({
        baseURL: "https://default89055e55191e4127b426bad22809e6.4a.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/17/workflows/b485fead598a41a2ba6f9f972db6487c/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7OSpeHhOV1nogYWXzNfN7nmzzihVsY1qVqoBGhijmAA",
        headers: {
          'Content-Type': 'application/json'
        },
        maxContentLength: 100 * 1024 * 1024, // 100 MB limit
        maxBodyLength: 100 * 1024 * 1024 // 100 MB limit
      });

      const body = {
        to: Array.isArray(receiver_email) ? receiver_email : [receiver_email],
        subject: subject,
        html: html,
      };

      const response = await api.post("", body);

      return { 
        success: true, 
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      // console.error("Error sending email:", error);

      // Axios-specific error handling
        if (error.response) {
            // The request was made and the server responded with a status code
            const err = { 
                success: false, 
                error: error.message,
                status: error.response.status,
                data: error.response.data
            };
            
            console.error(err);
            return err;
        } else if (error.request) {
            // The request was made but no response was received
            return { 
                success: false, 
                error: 'No response received from Power Automate flow',
                request: error.request
            };
        } else {
            // Something happened in setting up the request
            return { 
                success: false, 
                error: error.message,
                stack: error.stack
            };
        }
    }
};

module.exports = sendEmail;