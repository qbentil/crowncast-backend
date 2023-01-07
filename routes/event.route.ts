import { Router } from "express";
import { addEvent, getEvents } from "../controllers/event.controller";

const router = Router();

// GET EVENTS
router.get("/", getEvents)

// ADD EVENT
router.post("/", addEvent)

// GET EVENT BY ID
// router.get("/:id", getEventById)

export default router;