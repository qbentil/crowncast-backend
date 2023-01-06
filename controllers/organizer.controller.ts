import { ComparePassword, GenerateToken } from './../util/index';
import { NextFunction, Request, Response } from "express";
import { Organizer } from "../models";
import { CreateError, GeneratePIN } from "../util";
import Mail from "../mail";

// LOGIN
const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, pin } = req.body;
    try {
        const organizer = await Organizer.findOne({ email });
        if (!organizer) {
            return next(CreateError(404, "Organizer not found"));
        }

        const isMatch = await ComparePassword(pin, organizer.password);
        if (!isMatch) {
            return next(CreateError(401, "Invalid credentials"));
        }

        // Generate token
        const { accessToken, refreshToken } = GenerateToken(organizer, "Organizer");

        // update organizer with new refresh token
        await Organizer.findByIdAndUpdate(organizer._id, { token: refreshToken });

        // create cookie
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000, secure: true })

        // remove password, is_deleted and token from organizer object
        const { password, is_deleted, token, ...rest } = organizer._doc;

        // append access token to organizer object
        rest.accessToken = accessToken;

        res.status(200).json({
            success: true,
            data: rest,
            message: "Login successful"

        });

    } catch (error) {
        next(error);
    }
}

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
            // remove password, is_deleted and token from organizer object
            const { password, is_deleted, token, ...rest } = organizer._doc;
            // Send response to client
            res.status(201).json({
                success: true,
                data: rest,
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
        // remove password, is_deleted and token from organizer object
        const restData = organizers.map((organizer: any) => {
            const { password, is_deleted, token, ...rest } = organizer._doc;
            return rest;
        }) as any;
        res.status(200).json({
            success: true,
            data: restData,
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

        // remove password, is_deleted and token from organizer object
        const { password, is_deleted, token, ...rest } = organizer._doc;
        res.status(200).json({
            success: true,
            data: rest,
            message: "Organizer updated successfully"
        });
    } catch (err) {
        next(err);
    }
}



// Exports 
export { addOrganizer, getOrganizers, updateOrganizer, login };