import express from 'express';
import authHelper from '../helpers/auth-helper';

const router = express.Router();


router.post('/register', authHelper.register)

router.post('/login', authHelper.login)

//Check email availability
router.get('/checkEmail/:email', authHelper.checkIfEmailTaken)


export default router;