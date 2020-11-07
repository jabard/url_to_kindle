#!/usr/bin/node
'use strict';

const app = require('./app');
const logger = require('./logger');
const port = 3000;

app.listen(port, () => logger.info(`Listening at http://localhost:${port}\n`));
