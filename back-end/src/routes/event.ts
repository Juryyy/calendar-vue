import express from 'express';
import inputEventHelper from '../helpers/inputEvent-helper'

 
const router = express.Router();

router.get('/all', inputEventHelper.uploadUnsentEvents, inputEventHelper.fetchEventsFromG);

router.post('/create', inputEventHelper.createEvent, inputEventHelper.uploadUnsentEvents);

export default router;