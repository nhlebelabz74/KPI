const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const axios = require('axios');

const { verifyAccessToken, errorHandler } = require('./middleware');
const { authRouter, userRouter, responseRouter } = require('./routers');
const connectDB = require('./config/connectDB');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4774;

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://kpi-tracker-lnp.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get('/api/download', (req, res) => {
  const fileId = '1f0YQ__iQ1Y4VEiYLoDcKTxXa0fejV5ST';
  const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  // Simply redirect to Google Drive
  res.redirect(googleDriveUrl);
});

app.use('/api/auth', authRouter);
app.use('/api/users'/*, verifyAccessToken*/, [userRouter, responseRouter]);
app.use('/release', express.static(path.join(__dirname, 'release')));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(errorHandler);

app.all("*", (req, res) => {
    res.status(404).send("404 NOT FOUND")
});

connectDB();

mongoose.connection.on("connected", async () => {
    console.log("SUCCESSFULLY CONNECTED TO DATABASE");
    app.listen(port, () => {
        console.log(`server listening on port: ${port}...`)
    });
});
mongoose.connection.on("disconnected", () => {
    console.log("Lost connection to database")
});