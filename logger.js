const log = (msg, level) => {
    console.log(`${new Date().toISOString()} - ${level} - ${msg}`);
};

module.exports = {
  debug: (msg) => log(msg, 'DEBUG'),
  info: (msg) => log(msg, 'INFO'),
  warn: (msg) => log(msg, 'WARN'),
  error: (msg) => log(msg, 'ERROR')
};
