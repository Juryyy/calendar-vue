import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { apiConfig } from './config';
import router from './router';
import { scheduleAllTasks } from './scheduler';
import env from './utils/env';

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(router);
