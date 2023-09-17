import express from 'express';
import inputHelper from '../functions/inputEvent';
import googleHelper from '../functions/googleEvent';
import googleHelperAdmin from '../functions/googleEventAdmin';
import { jwtVerifyUser, jwtVerifyAdmin } from '../middlewear/jwtVerify';

const router = express.Router();
const uploadFetchMiddlewear= [inputHelper.uploadUnsentEvents, googleHelper.fetchEventsFromG, inputHelper.deleteUploadedEvents]


// * Admin check
router.use('/allevents', jwtVerifyAdmin);
router.use('/delete/:id', jwtVerifyAdmin);
router.use('/admin/userEvents/:id', jwtVerifyAdmin);

// * User check 
router.use('/all/:month', jwtVerifyUser);
router.use('/user', jwtVerifyUser);
router.use('/create', jwtVerifyUser);
router.use('/user/update', jwtVerifyUser);
router.use('/user/delete/:id', jwtVerifyUser);
router.use('/user/events', jwtVerifyUser);

//* Admin
/**
 * @swagger
 * /event/allevents:
 *   get:
 *     summary: Get all events (Admin)
 *     tags:
 *       - Admin
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/allevents', uploadFetchMiddlewear, googleHelperAdmin.getEvents, end);

/**
 * @swagger
 * /event/delete/{id}:
 *   delete:
 *     summary: Delete an event by ID (Admin)
 *     tags:
 *       - Admin
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete('/delete/:id', uploadFetchMiddlewear, googleHelperAdmin.deleteEvent, end);


/**
 * @swagger
 * /event/admin/userEvents/{id}:
 *   get:
 *     summary: Get all events for a specific user (Admin)
 *     tags:
 *       - Admin
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve events for
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/userEvents/:id', uploadFetchMiddlewear, googleHelperAdmin.getEventsForUser, end);
//* User
/**
 * @swagger
 * /event/all/{month}:
 *   get:
 *     summary: Get all events for a specific month (User)
 *     tags:
 *       - User
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         schema:
 *           type: string
 *         required: true
 *         description: Month (YYYY-MM) to retrieve events for
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/all/:month', uploadFetchMiddlewear, googleHelper.getEventsForMonth, end);

/**
 * @swagger
 * /event/user:
 *   get:
 *     summary: Get all events for the authenticated user
 *     tags:
 *       - User
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.use('/user/events', uploadFetchMiddlewear, googleHelper.getEventsForUser, end);

/**
 * @swagger
 * /event/user/next:
 *   get:
 *     summary: Get the next event for the authenticated user
 *     tags:
 *       - User
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/user/next', uploadFetchMiddlewear, googleHelper.getNextEventForUser, end);

/**
 * @swagger
 * /event/create:
 *   post:
 *     summary: Create a new event (User)
 *     tags:
 *       - User
 *       - Event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/create', inputHelper.createInputEvent, uploadFetchMiddlewear, end);

/**
 * @swagger
 * /event/user/update:
 *   post:
 *     summary: Update an event (User)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventUpdateInput'
 *     responses:
 *       200:
 *         description: Event updated
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/user/update', googleHelper.updateEvent, uploadFetchMiddlewear, end);

/**
 * @swagger
 * /event/user/delete/{id}:
 *   delete:
 *     summary: Delete an event by ID (User)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete('/user/delete/:id', uploadFetchMiddlewear, googleHelper.deleteEventById, end);

function end(){
    return;
}

export default router;