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

  const sent_to_kindle = await url_to_kindle(url, email_config, kindle_email);
  if (sent_to_kindle) {
    logger.info(`(${pass})'s (${url}) was sent to (${kindle_email})`);
  } else {
    logger.error(`(${pass})'s (${url}) was NOT sent to (${kindle_email})`);
  }

  const status_code = (sent_to_kindle ? 200 : 500);
  const response = {
    success: (sent_to_kindle ? `${url} was sent as a PDF to ${kindle_email}` : ''),
    error: (sent_to_kindle ? '' : 'Something went wrong. Contact the Admin!')
  }

  return res.status(status_code).json(response);
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Internal Serverl Error'
  });
});

module.exports = app;
