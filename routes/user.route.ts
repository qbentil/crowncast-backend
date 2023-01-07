import { VerifyAccessToken, VerifyAdmin } from './../middleware/verifications';
import { Router } from 'express';
import { addUser, getAllUsers, login } from '../controllers/user.controller';

const router = Router();

// LOGIN
router.post('/login', login);

// ADD USER
router.post('/', VerifyAccessToken, VerifyAdmin, addUser);

// GET ALL USERS
router.get('/', VerifyAccessToken, VerifyAdmin, getAllUsers);

export default router;