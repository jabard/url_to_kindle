const express = require('express');
const cors = require('cors');
const url_to_kindle = require('./url_to_kindle');
const logger = require('./logger');

require('dotenv').config();

const app = express();

const email_config = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SENDER_ADDRESS: process.env.SENDER_ADDRESS,
  SENDER_PASS: process.env.SENDER_PASS
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.all('/', async (req, res) => {
  const ALL_ADMIN_PASS = process.env.ADMIN_PASS.split(' ');
  const pass = req.query.password || req.body.password;
  if (!ALL_ADMIN_PASS.includes(pass)) {
    logger.warn(`Request not allowed (${pass})`);

    return res.status(401).json({
      error: 'Not allowed'
    });
  }

  const url = req.query.url || req.body.url;
  const kindle_email = req.query.email || req.body.email;
  if (!pass || !url || !kindle_email) {
    return res.status(400).json({
      error: 'Missing parameters'
    });
  }

  logger.info(`(${pass}) requested (${url}) be sent to (${kindle_email})`);

  let response = await url_to_kindle(url, email_config, kindle_email);
  let status_code = 200;

  if (response) {
    logger.info(`(${pass})'s (${url}) was sent to (${kindle_email})`);
  } else {
    logger.error(`(${pass})'s (${url}) was NOT sent to (${kindle_email})`);

    response = {
      error: 'Something went wrong. Contact the Admin!'
    }
    status_code = 500;
  }

  return res.status(status_code).json(response);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal Serverl Error'
  });
});

module.exports = app;
