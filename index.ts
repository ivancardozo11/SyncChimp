import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors'
import configureMailchimp from './mailchimp.config';
import router from './src/api/routes/api/v1/routes';




const app: Application = express();
dotenv.config();

app.use(cors());
app.use(helmet());
configureMailchimp();

app.use('/api/v1', router);

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log(`Your local server running on port ${port} 🚀🚀🚀🚀⚡⚡⚡⚡`);
})
export default app;