const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

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

app.get('/api/download', async (req, res) => {
  const fileId = '1f0YQ__iQ1Y4VEiYLoDcKTxXa0fejV5ST';
  const googleDriveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  try {
    console.log('Fetching file from Google Drive...');
    
    const response = await axios({
      method: 'GET',
      url: googleDriveUrl,
      responseType: 'stream'
    });
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=KPI-Tracker-3.0.1-Setup.exe',
      'Cache-Control': 'public, max-age=86400'
    });
    
    // Stream the response from Google Drive to the client
    response.data.pipe(res);
    
    console.log('File download started successfully');
    
    // Handle stream errors
    response.data.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).send('Error downloading file');
      }
    });
    
  } catch (error) {
    console.error('Error downloading from Google Drive:', error);
    res.status(500).json({ error: 'Error downloading file' });
  }
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