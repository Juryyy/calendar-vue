import express from 'express';
import inputHelper from '../functions/inputEvent-helper'
import googleHelper from '../functions/googleEvent-helper';
import googleHelperAdmin from '../functions/googleEventAdmin';
import { jwtVerifyUser, jwtVerifyAdmin } from '../middlewear/jwtVerify';

 
const router = express.Router();

// * Admin check
router.use('/all', jwtVerifyAdmin);
router.use('/delete/:id', jwtVerifyAdmin);

// * User check 
router.use('/all/:month', jwtVerifyUser);
router.use('/user', jwtVerifyUser);
router.use('/create', jwtVerifyUser);
router.use('/update', jwtVerifyUser);
router.use('/user/delete/:id', jwtVerifyUser)


const uploadFetchMiddlewear= [inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG, inputHelper.deleteUploadedEvents]

// * Admin Get
router.get('/all', uploadFetchMiddlewear, googleHelperAdmin.getEvents);

// * Admin Delete
router.delete('/delete/:id', uploadFetchMiddlewear, googleHelperAdmin.deleteEvent);

// * User Get
router.get('/all/:month', uploadFetchMiddlewear, googleHelper.getEventsForMonth);
router.get('/user', uploadFetchMiddlewear, googleHelper.getEventsForUser);
router.get('/user/next', uploadFetchMiddlewear, googleHelper.getNextEventForUser);

// * User Post
router.post('/create', inputHelper.createInputEvent, uploadFetchMiddlewear);
router.post('/update', inputHelper.updateEvent, uploadFetchMiddlewear);

export default router;