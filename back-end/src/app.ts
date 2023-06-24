import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import router from './router';
import dotEnv from 'dotenv';

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(dotEnv.config({ path: './back-end/.env' }), () => {
  console.log('Server running on port 4000');
});
