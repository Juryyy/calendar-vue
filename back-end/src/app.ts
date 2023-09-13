import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import router from './router';
import { verifyAndDeleteExpiredToken } from './google/verifytoken';

const tokenFilePath = '../back-end/token.json';
const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

export default app;