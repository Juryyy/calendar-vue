import express from 'express';
import inputHelper from '../helpers/inputEvent-helper'
import googleHelper from '../helpers/googleEvent-helper';

 
const router = express.Router();

router.get('/all', inputHelper.uploadUnsentEvents, inputHelper.fetchEventsFromG, googleHelper.getEvents);
router.get('/', googleHelper.test )

router.post('/create', inputHelper.createInputEvent, inputHelper.uploadUnsentEvents);

export default router;