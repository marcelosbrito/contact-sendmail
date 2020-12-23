require('dotenv').config(path.resolve( __dirname, '/key.env'));
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// E-mail Account SETUP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    type: "OAUTH2",
    user: process.env.GMAIL_USERNAME,  //set these in your .env file
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
    expires: 3599
  }
});

// verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// verify APP connection
app.get('/app', (req, res, next) => {
  res.send('APP RUNNING OK')
})

//Post Setup & sending contact form content
app.post('/send', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message
  const content = `name: ${name}\n email: ${email}\n message: ${message}`
  const mail = {
    from: name,
    to: 'marcellus.brito@gmail.com', // receiver email
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log(err);
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
    }
  })
})
exports.app = functions.https.onRequest(app);