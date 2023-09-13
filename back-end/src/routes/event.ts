import express from 'express';
import inputHelper from '../functions/inputEvent'
import googleHelper from '../functions/googleEvent';
import googleHelperAdmin from '../functions/googleEventAdmin';
import { jwtVerifyUser, jwtVerifyAdmin } from '../middlewear/jwtVerify';


const router = express.Router();

// * Admin check
router.use('/allevents', jwtVerifyAdmin);
router.use('/delete/:id', jwtVerifyAdmin);

// * User check 
router.use('/all/:month', jwtVerifyUser);
router.use('/user', jwtVerifyUser);
router.use('/create', jwtVerifyUser);
router.use('/update', jwtVerifyUser);
router.use('/user/delete/:id', jwtVerifyUser)


const uploadFetchMiddlewear= [inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG, inputHelper.deleteUploadedEvents]

// * Admin Get
router.get('/allevents', uploadFetchMiddlewear, googleHelperAdmin.getEvents, end);

// * Admin Delete
router.delete('/delete/:id', uploadFetchMiddlewear, googleHelperAdmin.deleteEvent, end);

// * User Get
router.get('/all/:month', uploadFetchMiddlewear, googleHelper.getEventsForMonth, end);
router.get('/user', uploadFetchMiddlewear, googleHelper.getEventsForUser, end);
router.get('/user/next', uploadFetchMiddlewear, googleHelper.getNextEventForUser, end);

// * User Post
router.post('/create', inputHelper.createInputEvent, uploadFetchMiddlewear, end);
router.post('/update', inputHelper.updateEvent, uploadFetchMiddlewear, end);

function end(){
    return
}

export default router;