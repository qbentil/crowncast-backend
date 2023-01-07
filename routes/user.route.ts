import { VerifyAccessToken, VerifyAdmin } from './../middleware/verifications';
import { Router } from 'express';
import { addUser, changePassword, getAllUsers, login, resetPassword } from '../controllers/user.controller';

const router = Router();

// LOGIN
router.post('/login', login);

// ADD USER
router.post('/', VerifyAccessToken, VerifyAdmin, addUser);

// GET ALL USERS
router.get('/', VerifyAccessToken, VerifyAdmin, getAllUsers);

//  CHANGE PASSWORD
router.put("/password", VerifyAccessToken, changePassword);

// RESET PASSWORD 
router.put("/reset-password/:id", VerifyAccessToken, VerifyAdmin, resetPassword);

export default router;