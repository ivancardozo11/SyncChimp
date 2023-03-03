import mailchimp from '@mailchimp/mailchimp_marketing';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './src/api/routes/api/v1/routes.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(morgan('dev'));

// Set up Mailchimp configuration
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

app.use('/api/v1', router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your local server running on port ${port} 🚀🚀🚀🚀⚡⚡⚡⚡`);
});

export default app;
