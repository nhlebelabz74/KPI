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

app.get('/api/download', (req, res) => {
  const exePath = path.join(__dirname, 'release', 'KPI-Tracker-Setup-1.0.0.exe');
  
  // Check if file exists first
  if (!fs.existsSync(exePath)) {
    return res.status(404).send('Installer file not found');
  }
  
  // Set appropriate headers
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=KPI-Tracker-Setup-1.0.0.exe',
    'Cache-Control': 'public, max-age=86400',
    'Expires': new Date(Date.now() + 86400000).toUTCString()
  });
  
  // Stream the file instead of loading it all into memory
  const fileStream = fs.createReadStream(exePath);
  fileStream.pipe(res);
  
  fileStream.on('error', (err) => {
    console.error('Error streaming file:', err);
    if (!res.headersSent) {
      res.status(500).send('Error downloading file');
    }
  });
});

app.use('/api/auth', authRouter);
app.use('/api/users', verifyAccessToken, [userRouter, responseRouter]);

// app.use('/api/v1', verifyAccessToken, [memberRouter, eventRouter, userRouter]);

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