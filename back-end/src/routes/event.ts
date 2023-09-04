import express from 'express';
import inputHelper from '../helpers/inputEvent-helper'
import googleHelper from '../helpers/googleEvent-helper';

 
const router = express.Router();

const uploadFetchMiddlewear= [inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG]
// ! TODO: ADMIN CHECK
router.get('/all', uploadFetchMiddlewear, googleHelper.getEvents);

router.get('/all/:month', uploadFetchMiddlewear, googleHelper.getEventsForMonth);
router.get('/all/:id', uploadFetchMiddlewear, googleHelper.getEventsForUser);

router.post('/create', inputHelper.createInputEvent, uploadFetchMiddlewear);

router.post('/update', inputHelper.updateEvent, uploadFetchMiddlewear);

export default router;