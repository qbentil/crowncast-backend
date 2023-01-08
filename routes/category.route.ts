import { addCategory, getCategories } from '../controllers/category.controller';
import { Router } from "express";

const router = Router()

// GET CATEGORIES
router.get("/", getCategories)

// CREATE CATEGORY
router.post("/", addCategory)

export default router