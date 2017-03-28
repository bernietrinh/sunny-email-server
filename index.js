'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const cors = require('express-cors');

const emailConfig = require('./config/' + process.env.NODE_ENV);
const transporter = nodemailer.createTransport(emailConfig);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(cookieParser());

app.use(cors({
  allowedOrigins: [emailConfig.cors]
}));


// routes ================================================
app.post('/api/inquiry', function (req, res) {
  const customerInfo = req.body;
  const { name, phoneNumber, email, comments, service }  = customerInfo;

  let mailOptions = {
    from: emailConfig.auth.user,
    to: emailConfig.toAddress,
    subject: 'New inquiry from ' + name,
    html: '<p><b>E-mail: </b>' + email + '</p>' +
      '<p><b>Name: </b>' + name + '</p>' +
      '<p><b>Phone number: </b>' + phoneNumber + '</p>' +
      '<p><b>For service: </b>' + service + '</p>' +
      '<p><b>Inquiry: </b>' + comments + '</p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error sending email to ${email}`, error);
      return res.sendStatus(400);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    res.json({ success: true });

  });


});

app.listen(8080, () => {
  console.log(`Sunny email server listening on port 8080!`);
});


module.exports = app;