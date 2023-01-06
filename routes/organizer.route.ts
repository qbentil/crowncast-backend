import { Router } from "express";
import { addOrganizer, getOrganizers } from "../controllers/organizer.controller";

const router = Router();

// ADD ORGANIZER
/**
 * @swagger
 * /organizer:
 * post: 
 * summary: Add organizer
 * description: Add organizer
 * TODO: Verify Admin Token 
 */

router.post("/", addOrganizer);

// FETCH ALL ORGANIZERS
/** 
 * @swagger
 * /organizer:
 * get:
 * summary: Get all organizers
 * description: Get all organizers
 * TODO:
*/
router.get("/", getOrganizers);

export default router;

