import { VerifyAccessToken, VerifyAdmin } from './../middleware/verifications';
import { Router } from "express";
import { addOrganizer, changePassword, getOrganizer, getOrganizers, login, resetPassword } from "../controllers/organizer.controller";

const router = Router();

// LOGIN ORGANIZER
/**
 * @route POST /organizer/login
 * @description Login organizer
 * @access Public
 * @returns {Object} Organizer as data
 *
 */
router.post("/login", login);

// ADD ORGANIZER
/**
 * @swagger
 * /organizer:
 * post: 
 * summary: Add organizer
 * description: Add organizer
 * TODO: Verify Admin Token 
 */

router.post("/", VerifyAccessToken, VerifyAdmin, addOrganizer);

// FETCH ALL ORGANIZERS
/** 
 * @swagger
 * /organizer:
 * get:
 * summary: Get all organizers
 * description: Get all organizers
 * TODO:
*/
router.get("/", VerifyAccessToken, VerifyAdmin, getOrganizers);

// GET ORGANIZER BY ID
router.get("/:id",VerifyAccessToken, VerifyAdmin, getOrganizer)

//  CHANGE PASSWORD
router.put("/password", VerifyAccessToken, changePassword);

// RESET PASSWORD 
router.put("/reset-password/:id", VerifyAccessToken, VerifyAdmin, resetPassword);




export default router;

