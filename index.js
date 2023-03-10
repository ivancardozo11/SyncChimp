import mailchimp from '@mailchimp/mailchimp_marketing';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import router from './src/api/routes/api/v1/routes.js';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

dotenv.config();

const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss' }),
    winston.format.errors(),
    winston.format.json()
  ),
  defaultMeta: { service: 'syncChimp-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '1m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/daily-rotate-logs/combined-%DATE%.log',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '1m',
      maxFiles: '14d'
    })
  ],
});

// Manejador de errores global
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Set up Mailchimp configuration
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});
app.use('/api/v1', router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Your local server running on port ${port} 🚀🚀🚀🚀⚡⚡⚡⚡`);
});

export default app;
