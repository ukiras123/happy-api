const { format, createLogger, transports } = require('winston');

const {
  timestamp, combine, printf, errors, json,
} = format;

function buildDevLogger() {
  const logFormat = printf(({
    level, message, timestamp, stack,
  }) => `${timestamp} ${level}: ${stack || message}`);

  return createLogger({
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
}

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'happy-api' },
    transports: [new transports.Console()],
  });
}

let logger;
if (process.env.NODE_ENV === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

module.exports = logger;
