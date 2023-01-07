import { VerifyAccessToken } from './../middleware/verifications';
import { Router } from 'express';
import { addContestant, getContestantById, getContestants } from '../controllers/contestant.controller';
const router = Router();

// ADD CONTESTANT
router.post("/", VerifyAccessToken, addContestant)

// GET CONTESTANTS
router.get("/", getContestants)

router.get("/:id", getContestantById)

export default router;

