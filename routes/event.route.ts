import { Router } from "express";
import { getEvents } from "../controllers/event.controller";

const router = Router();

// GET EVENTS
router.get("/", getEvents)

// GET EVENT BY ID
// router.get("/:id", getEventById)

export default router;