import { Router } from 'express';
import { addUser, getAllUsers, login } from '../controllers/user.controller';

const router = Router();

// LOGIN
router.post('/login', login);

// ADD USER
router.post('/', addUser);

// GET ALL USERS
router.get('/', getAllUsers);

export default router;