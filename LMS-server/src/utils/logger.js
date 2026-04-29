const winston = require('winston');
const fs = require('fs');
const path = require('path');

//  Ensure log directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

//  Define Winston Logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ format: winston.format.colorize() }), // Console logs
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }), // Error logs
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }) // All logs
    ]
});

module.exports = logger;
