import { Request, Response, NextFunction } from 'express';
import { CreateError, GenerateContestantCode } from '../util';
import { Contestant } from '../models';
import mongoose from 'mongoose';

// ADD CONTESTANT
export const addContestant = async (req: Request, res: Response, next: NextFunction) => {
    const { name, image, biography, code, event, category } = req.body;
    // const { user } = req;
    // if(user.role.toLowerCase() !== "admin") {

    // }
    // generate contestant code if not provided
    if (!code) {
        req.body.code = GenerateContestantCode({ name, event });
    }

    // check if all fields are provided
    if (!name || !image || !event) {
        return next(CreateError(400, "All fields are required"));
    }

    try {
        const contestant = await Contestant.create(req.body);

        res.status(201).json({
            success: true,
            data: contestant,
            message: "Contestant created successfully"
        });

    } catch (error) {
        next(error);
    }
}

//  FETCH ALL CONTESTANTS
export const getContestants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get contestants with category details and event details with organizer details
        const contestants = await Contestant.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true // overlook uncategorized contestants
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "event",
                    foreignField: "_id",
                    as: "event",
                },
            },
            {
                $unwind: "$event",
            },
            {
                $lookup: {
                    from: "organizers",
                    localField: "event.organizer",
                    foreignField: "_id",
                    as: "event.organizer",
                },
            },
            {
                $unwind: "$event.organizer",
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    biography: 1,
                    code: 1,
                    votes: 1,
                    status: 1,
                    category: {
                        _id: "$category._id",
                        title: "$category.title",
                        description: "$category.description",
                    },
                    event: {
                        _id:"$event._id",
                        name: "$event.name",
                        description: "$event.description",
                        banner: "$event.banner",
                        vote_price: "$event.vote_price",
                        opening_date: "$event.opening_date",
                        closing_date: "$event.closing_date",
                        organizer: {
                            name: "$event.organizer.name",
                            email: "$event.organizer.email",
                            phone: "$event.organizer.phone",
                            company: "$event.organizer.company",
                            address: "$event.organizer.address",
                        },
                    },
                    createdAt:1,
                    updatedAt: 1,
                },
            },
        ])

        res.status(200).json({
            success: true,
            data: contestants,
            message: "Contestants fetched successfully"
        });

    } catch (error) {
        next(error);
    }
}

// GET CONTESTANT BY ID
export const getContestantById = async (req: Request, res: Response, next: NextFunction) => {
    const  {id} = req.params;
    try {
        // contestant with category details and event details with organizer details
        const contestant = await Contestant.aggregate([
            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(id)
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true // overlook uncategorized contestants
                }
            },
            {
                $lookup: {
                    from: "events",
                    localField: "event",
                    foreignField: "_id",
                    as: "event",
                },
            },
            {
                $unwind: "$event",
            },
            {
                $lookup: {
                    from: "organizers",
                    localField: "event.organizer",
                    foreignField: "_id",
                    as: "event.organizer",
                },
            },
            {
                $unwind: "$event.organizer",
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    biography: 1,
                    code: 1,
                    votes: 1,
                    status: 1,
                    category: {
                        _id: "$category._id",
                        title: "$category.title",
                        description: "$category.description",
                    },
                    event: {
                        _id: "$even._id",
                        name: "$event.name",
                        description: "$event.description",
                        banner: "$event.banner",
                        vote_price: "$event.vote_price",
                        opening_date: "$event.opening_date",
                        closing_date: "$event.closing_date",
                        organizer: {
                            name: "$event.organizer.name",
                            email: "$event.organizer.email",
                            phone: "$event.organizer.phone",
                            company: "$event.organizer.company",
                            address: "$event.organizer.address",
                        },
                    },
                    createdAt:1,
                    updatedAt: 1,
                },  
            },
            
        ])

        if(!contestant) {
            return next(CreateError(404, "Contestant not found"));
        }

        res.status(200).json({
            success: true,
            data: contestant[0],
            message: "Contestant fetched successfully"
        });

    } catch (error) {
        next(error)
    }
}