import express from 'express';
import authHelper from '../functions/auth-helper';

const router = express.Router();


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       401:
 *         description: Please fill all the fields
 *       402:
 *         description: Email taken
 */
router.post('/register', authHelper.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authHelper.login);

/**
 * @swagger
 * /auth/checkEmail/{email}:
 *   get:
 *     summary: Check if email is taken
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email to check
 *     responses:
 *       200:
 *         description: Email available
 *       402:
 *         description: Email taken
 */
router.get('/checkEmail/:email', authHelper.checkIfEmailTaken);

export default router;