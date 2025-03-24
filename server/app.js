const express = require('express');

const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/model', express.static('./models', {
  maxAge: 31536000000, // 1 year cache
  setHeaders: function (res, path) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// remember to add the jwt stuff here

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}...`)
});