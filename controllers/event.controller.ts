import { NextFunction, Request, Response } from "express";
import Event from "../models/event.model";

// CREATE EVENT
const addEvent = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, banner, vote_price, opening_date, closing_date, organizer } = req.body;
    try {
        const event = await Event.create({
            name,
            description,
            banner,
            vote_price,
            opening_date,
            closing_date,
            organizer,
        });
        res.status(201).json({
            success: true,
            data: event,
            message: "Event created successfully",
        });
    } catch (err) {
        next(err);
    }
}

// FETCH ALL EVENTS
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