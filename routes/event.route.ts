import { Router } from "express";
import { getEvents } from "../controllers/event.controller";

const router = Router();

// GET EVENTS
router.get("/", getEvents)

export default router;