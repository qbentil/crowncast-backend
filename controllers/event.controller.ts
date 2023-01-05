import { NextFunction, Request, Response } from "express";
import Event from "../models/event.model";

const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await Event.find({ is_deleted: false });
        res.status(200).json({
            success: true,
            data: events,
            message: "Events fetched successfully",
        });
    } catch (err) {
        next(err);
    }
}

export { getEvents };