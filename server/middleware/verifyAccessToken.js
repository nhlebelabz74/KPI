// imports
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @description Middleware function to verify the access token. 
 * The access token can be in the authorization header or in a cookie. If no valid access token is found, 
 * a 401 error response is sent. If the token has expired or was corrupted, a 403 error response is sent
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
const verifyAccessToken = async (req, res, next) => {
    // Get the Authorization header from the request
    const authHeader = req.headers.Authorization || req.headers.authorization;

    // get the accessToken from the Auth header (if it exists) or the cookies
    const accessToken = (authHeader?.startsWith('Bearer') ? 
                            authHeader.split(' ')[1] : null) || req.cookies.accessToken;

    // no access token means admin is unauthorized and an access token must be created
    if (!accessToken)
        return res.status(401).json({ 
            message: "You are unauthorized to access this resource"
        });

    // Verify the access token using the jwt.verify function
    jwt.verify(
        // The access token to verify
        accessToken,
        // The secret used to sign the access token
        process.env.ACCESS_TOKEN_SECRET,
        // The callback to execute once the token is verified or if there is an error with verification
        (err, decoded) => {
            // If there was an error verifying the token, the token was corrupted or has expired and a new one must be made
            if (err) {
                // Send a 403 Forbidden response with a message and end the middleware function
                return res.status(403).json({ message: "You are forbidden from accessing this resource" }); // "your session has expired" kinda thing
            }

            // If the token was verified successfully, add the decoded admin info to the request object
            req.userInfo = decoded.userInfo;
            // Call the next middleware function
            next();
        }
    );
}

// Export the verifyAccessToken function as a module
module.exports = verifyAccessToken;