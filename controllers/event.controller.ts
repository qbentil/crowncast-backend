import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../models/event.model";

// CREATE EVENT
const addEvent = async (req: Request, res: Response, next: NextFunction) => {
	const {
		name,
		description,
		banner,
		vote_price,
		opening_date,
		closing_date,
		organizer,
	} = req.body;
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
};

// FETCH ALL EVENTS
const getEvents = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// get events with organizer details
		const eventsWithOrganizer = await Event.aggregate([
			{
				$lookup: {
					from: "organizers",
					localField: "organizer",
					foreignField: "_id",
					as: "organizer",
				},
			},
			{
				$unwind: "$organizer",
			},
			{
				$project: {
					name: 1,
					description: 1,
					banner: 1,
					vote_price: 1,
					votes: 1,
					opening_date: 1,
					closing_date: 1,
					organizer: {
						name: "$organizer.name",
						email: "$organizer.email",
						phone: "$organizer.phone",
						company: "$organizer.company",
						address: "$organizer.address",
					},
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: eventsWithOrganizer,
			message: "Events fetched successfully",
		});
	} catch (err) {
		next(err);
	}
};

// GET EVENT by ID
const getEventById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params;

	try {
		const event = await Event.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(id),
				},
			},
			{
				$limit: 1,
			},
			{
				$lookup: {
					from: "organizers",
					localField: "organizer",
					foreignField: "_id",
					as: "organizer",
				},
			},
			{
				$unwind: "$organizer",
			},
			{
				$project: {
					name: 1,
					description: 1,
					banner: 1,
					vote_price: 1,
					votes: 1,
					opening_date: 1,
					closing_date: 1,
					organizer: {
						name: "$organizer.name",
						email: "$organizer.email",
						phone: "$organizer.phone",
						company: "$organizer.company",
						address: "$organizer.address",
					},
				},
			},
		]);

		res.status(200).json({
			success: true,
			data: event[0],
			message: "Event fetched successfully",
		});
	} catch (err) {
		next(err);
	}
};

// UPDATE
const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { ...updateValues } = req.body;
	try {
		const updatedEvent = await Event.findByIdAndUpdate(
			req.params.id,
			{
				...updateValues,
			},
			{ new: true }
		);
		const { is_deleted, ...rest } = updatedEvent;
		res.status(200).json({
			success: true,
			data: rest,
		});
	} catch (err) {
		next(err);
	}
};

// DELETE
const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const deletedEvent = await Event.findByIdAndUpdate(
			req.params.id,
			{
				is_deleted: true,
			},
			{ new: true }
		);

		// remove is_deleted before sending to user
		const { is_deleted, ...rest } = deletedEvent;
		res.status(200).json({
			success: true,
			data: rest,
			message: "Event deleted successfully",
		});
	} catch (err) {
		next(err);
	}
};

export { getEvents, addEvent, getEventById, deleteEvent };
