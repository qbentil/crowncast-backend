import { NextFunction, Request, Response } from "express";
import { Organizer } from "../models";
import { BcryptPassword, CreateError, GeneratePIN } from "../util";
import Mail from "../mail";

// ADD ORGANIZER
const addOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, company, address } = req.body;

    try {

        // check if organizer already exists
        const organizerExists = await Organizer.findOne({ email });
        if (organizerExists) {
            return next(CreateError(409, "Organizer already exists"));
        }

        const { password, hashedPassword } = await GeneratePIN(8); // Generate a random 8 digit password and hash it

        // Create organizer
        const organizer = await Organizer.create({
            name,
            email,
            phone,
            company,
            password: hashedPassword,
            address
        });

        // Send onboarding email to organizer with generated password
        Mail.OnboardingMail({ name, email, password, role: "Organizer" }, (info: any) => {

            // Send response to client
            res.status(201).json({
                success: true,
                data: organizer,
                message: "Organizer created successfully"
            });
        })

    } catch (err) {
        next(err);
    }
}

// FETCH ALL ORGANIZERS
const getOrganizers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizers = await Organizer.find({ is_deleted: false });
        res.status(200).json({
            success: true,
            data: organizers,
            message: "Organizers fetched successfully"
        });
    } catch (err) {
        next(err);
    }
}

// UPDATE ORGANIZER
const updateOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, company, address } = req.body;
    try {
        const organizer = await Organizer.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            company,
            address
        }, { new: true });
        res.status(200).json({
            success: true,
            data: organizer,
            message: "Organizer updated successfully"
        });
    } catch (err) {
        next(err);
    }
}



// Exports 
export { addOrganizer, getOrganizers };