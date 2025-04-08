const jwt = require("jsonwebtoken");
require("dotenv").config();

const { asyncWrapper }= require('../../middleware');
const { User } = require('../../models');

// endpoint: /login
const loginController = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password }).exec();

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const name = user.name;

    // Generate access token
    const accessToken = jwt.sign(
        { userInfo: { name, email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1800s" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
        { name, email }, // Include email for validation in refreshController
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    // Update user with refresh token
    await User.updateOne({ email: email }, { refreshToken: refreshToken });

    // Set refresh token cookie
    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'None',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    });

    // Set access token cookie
    res.cookie("accessToken", accessToken, { 
        httpOnly: true,
        secure: true,
        partitioned: true,
        sameSite: 'None',
        maxAge: 1000 * 60 * 30 // 30 mins
    });

    res.status(200).json({ message: "Logged in successfully", accessToken, user });
});

module.exports = loginController;