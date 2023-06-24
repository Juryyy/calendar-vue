import express from 'express';

const router = express.Router();

router.get('/events', fetchEvents);

router.post('/events', createEvent);
