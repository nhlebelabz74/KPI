const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const { asyncWrapper } = require("../../middleware");
require("dotenv").config();

// endpoint: /refresh
const refreshController = asyncWrapper(async (req, res) => {
    // Get the refresh token from the cookies
    const refreshToken = req?.cookies?.jwt;
    
    // If there are no cookies or the refresh token does not exist, the user is unauthorized
    if (!refreshToken) {
        return res.status(401).json({ message: "You are unauthorized from accessing this resource" });
    }

    try {
        // Find the user associated with the refresh token - use findOne instead of find
        const user = await User.findOne({ refreshToken: refreshToken });
        
        if (!user) {
            // If no user is found with the given refresh token, the user is forbidden
            return res.status(403).json({ 
                message: "You are forbidden from accessing this resource.", 
                status: 403 
            });
        }

        // Verify the refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                // If there's an error verifying the token or user info doesn't match
                if (err || (decoded.name !== user.name || decoded.email !== user.email)) {
                    // The refresh token has expired and the user will be logged out
                    return res.status(403).json({ 
                        message: "Refresh Token expired or corrupted. Logging out" 
                    });
                }

                // Create a new access token with the user's information
                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            name: decoded.name,
                            email: user.email
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "1800s" } // 30 mins
                );

                // Store the user's information in the request object
                req.userInfo = {
                    name: decoded.name,
                    email: user.email
                };

                // Set the new access token in the cookies
                res.cookie("accessToken", accessToken, { 
                    httpOnly: true,
                    secure: true,
                    partitioned: true,
                    sameSite: 'None',
                    maxAge: 1000 * 60 * 30 // 30 mins
                });

                // Send success response
                res.status(201).json({ 
                    message: "Access Token refreshed successfully",
                    accessToken: accessToken
                });
            }
        );
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({ 
            message: "Server error during token refresh" 
        });
    }
});

module.exports = refreshController;