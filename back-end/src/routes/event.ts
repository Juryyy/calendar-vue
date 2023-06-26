import express from 'express';
import inputHelper from '../helpers/inputEvent-helper'
import googleHelper from '../helpers/googleEvent-helper';

 
const router = express.Router();

router.get('/all', inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG, googleHelper.getEvents);
router.get('/all/:month', inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG, googleHelper.getEventsForMonth);

router.post('/create', inputHelper.createInputEvent, inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG);
router.post('/create/test', inputHelper.test)

export default router;