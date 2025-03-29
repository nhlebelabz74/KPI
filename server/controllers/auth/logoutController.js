const { User } = require('../../models');
const { asyncWrapper } = require('../../middleware');

// endpoint: /logout
const logoutController = asyncWrapper(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(204).json({ message: "Already logged out" });
    }

    const refreshToken = cookies.jwt;

    // Find user by refresh token
    const user = await User.findOne({ refreshToken: refreshToken }).exec();

    // Clear refresh token in DB if found
    if (user) { // would be strange if user is not found
        user.refreshToken = "";
        await user.save();
    }

    // Clear cookies with same options used in login
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    res.status(200).json({ message: "Logged out successfully" });
});

module.exports = logoutController;