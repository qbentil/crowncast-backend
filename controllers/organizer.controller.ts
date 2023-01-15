import { ComparePassword, GenerateToken, HashPassword } from './../util/index';
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

        // check if organizer is inactive or deleted
        if (organizer.is_deleted || !organizer.is_active) {
            return next(CreateError(401, "Organizer account is inactive or deleted"));
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

        // append access_token and usertype to organizer object
        rest.accessToken = accessToken;
        rest.userType = "organizer";

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

// FETCH ORGANIZER
const getOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizer = await Organizer.findById(req.params.id);

        // check if organizer exists and is not deleted or inactive
        if (!organizer || organizer.is_deleted || organizer.status === "inactive") {
            return next(CreateError(404, "Organizer not found"));
        }

        // remove password, is_deleted and token from organizer object
        const { password, is_deleted, token, ...rest } = organizer._doc;
        res.status(200).json({
            success: true,
            data: rest,
            message: "Organizer fetched successfully"
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


// DELETE ORGANIZER
const deleteOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizer = await Organizer.findByIdAndUpdate(req.params.id, {
            is_deleted: true
        }, { new: true });

        // remove password, is_deleted and token from organizer object
        const { password, is_deleted, token, ...rest } = organizer._doc;
        res.status(200).json({
            success: true,
            data: rest,
            message: "Organizer deleted successfully"
        });
    } catch (err) {
        next(err);
    }
}

// DISABLE ORGANIZER
const disableOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizer = await Organizer.findByIdAndUpdate(req.params.id, {
            status: "inactive"
        }, { new: true });

        // remove password, is_deleted and token from organizer object
        const { password, is_deleted, token, ...rest } = organizer._doc;
        res.status(200).json({
            success: true,
            data: rest,
            message: "Organizer disabled successfully"
        });
    } catch (err) {
        next(err);
    }
}

// CHANGE ORGANIZER PASSWORD
const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user
    try {
        const organizer = await Organizer.findById(id);

        // check if organizer exists and is not deleted or inactive
        if (!organizer || organizer.is_deleted || organizer.status === "inactive") {
            return next(CreateError(404, "Organizer not found"));
        }

        // check if old password is correct
        const isMatch = await ComparePassword(oldPassword, organizer.password);
        if (!isMatch) {
            return next(CreateError(401, "Incorrect password"));
        }

        // hash new password
        const hashedPassword = await HashPassword(newPassword);

        // update organizer password
        await Organizer.findByIdAndUpdate(id, { password: hashedPassword });

        Mail.CHANGEPASSWORDMAIL({ name: organizer.name, email: organizer.email, role: "Organizer" }, (info: any) => {
            res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });
        })

    } catch (err) {
        next(err);
    }
}

// RESET ORGANIZER PASSWORD
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const organizer = await Organizer.findById(id);
        // check if organizer exists and is not deleted or inactive
        if (!organizer || organizer.is_deleted || organizer.status === "inactive") {
            return next(CreateError(404, "Organizer not found"));
        }
        const { password, hashedPassword } = await GeneratePIN(8); // Generate a random 8 digit password and hash it

        await Organizer.findByIdAndUpdate(id, { password: hashedPassword });

        // send email to user
        await Mail.RESETPASSWORDMAIL({ name: organizer.name, email: organizer.email, password, role: "Organizer" }, (info: any) => {
            res.status(200).json({
                success: true,
                message: "Password reset successfully"
            });
        });

    } catch (err) {
        next(err);
    }
}







// Exports 
export { addOrganizer, getOrganizers, updateOrganizer, login, deleteOrganizer, disableOrganizer, getOrganizer, changePassword, resetPassword };