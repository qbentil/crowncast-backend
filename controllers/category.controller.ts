import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';
import { CreateError } from '../util';
export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, event } = req.body;
    try {
        // check if category already exist for the event
        const category = await Category.findOne({ title, event });
        if (category) {
            return next(CreateError(400, "Category already exist for this event"));
        }

        // create category
        const newCategory = await Category.create({ title, description, event });
        if (!newCategory) {
            return next(CreateError(500, "Error creating category"));
        }

        res.status(201).json({
            success: true,
            data: newCategory,
            message: "Category created successfully"
        })

    } catch (error) {
        next(error);
    }
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            return next(CreateError(404, "No category found"));
        }

        res.status(200).json({
            success: true,
            data: categories,
            message: "Categories fetched successfully"
        })

    } catch (error) {
        next(error);
    }
}