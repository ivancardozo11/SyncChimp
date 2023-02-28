import mailchimp from '@mailchimp/mailchimp_marketing';
import dotenv from 'dotenv';

dotenv.config();

const mailchimpConfig = {
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
};

mailchimp.setConfig(mailchimpConfig);

export default mailchimpConfig;
