import { ComparePassword, GenerateToken, HashPassword } from './../util/index';
import { NextFunction, Request, Response } from "express";
import { CreateError, GeneratePIN } from "../util";
import Mail from "../mail";
import { User } from '../models';

// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, pin } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(CreateError(404, "Admin not found"));
        }

        // check if user is inactive or deleted
        if (user.is_deleted || user.status !== "active") {
            return next(CreateError(401, "Admin account is inactive or deleted"));
        }

        const isMatch = await ComparePassword(pin, user.password);
        if (!isMatch) {
            return next(CreateError(401, "Invalid credentials"));
        }

        // Generate token
        const { accessToken, refreshToken } = GenerateToken(user, "Admin");

        // update user with new refresh token
        await User.findByIdAndUpdate(user._id, { token: refreshToken });

        // create cookie
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000, secure: true })

        // remove password, is_deleted and token from user object
        const { password, is_deleted, token, ...rest } = user._doc;

        // append access_token and usertype to user object
        rest.accessToken = accessToken;
        rest.userType = "admin";

        res.status(200).json({
            success: true,
            data: rest,
            message: "Login successful"

        });

    } catch (error) {
        next(error);
    }
}

// ADD USER
export const addUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone } = req.body;
    try {
        // check if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return next(CreateError(409, "User already exists"));
        }

        const { password, hashedPassword } = await GeneratePIN(8); // Generate a random 8 digit password and hash it

        // create new user
        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        // send email to user
        await Mail.OnboardingMail({ name, email, password, role: "Admin" }, (info: any) => {
            // remove password, is_deleted and token from user object
            const { password, is_deleted, token, ...rest } = newUser._doc;
            res.status(200).json({
                success: true,
                data: rest,
                message: "User created successfully"
            });
        });


    } catch (error) {
        next(error);
    }
}

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ is_deleted: false });

        // remove password, is_deleted and token from user object
        const filteredUsers = users.map((user: any) => {
            const { password, is_deleted, token, ...rest } = user._doc;
            return rest;
        });
        res.status(200).json({
            success: true,
            data: filteredUsers,
            message: "Users fetched successfully"
        });
    } catch (error) {
        next(error);
    }
}

// UPDATE USER
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone } = req.body;
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, {
            name, email, phone
        })

        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        // remove password, is_deleted and token from user object
        const { password, is_deleted, token, ...rest } = user._doc;

        res.status(200).json({
            success: true,
            data: rest,
            message: "User updated successfully"
        });

    } catch (error) {
        next(error);
    }
}

// DELETE USER
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, {
            is_deleted: true
        }, { new: true })

        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        // remove password, is_deleted and token from user object
        const { password, is_deleted, token, ...rest } = user._doc;

        res.status(200).json({
            success: true,
            data: rest,
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}

// CHANGE PASSWORD
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    try {
        const user = await User.findById(id);
        if (!user || user.is_deleted || user.status !== "active") {
            return next(CreateError(404, "User not found"));
        }

        const isMatch = await ComparePassword(oldPassword, user.password);
        if (!isMatch) {
            return next(CreateError(401, "Invalid credentials"));
        }

        const hashedPassword = await HashPassword(newPassword);

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        await Mail.CHANGEPASSWORDMAIL({ name: user && user.name, email: user && user.email, role: "Admin" }, (info: any) => {
            res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });
        });

    } catch (error) {
        next(error);
    }
}

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user || user.is_deleted || user.status !== "active") {
            return next(CreateError(404, "User not found"));
        }

        const { password, hashedPassword } = await GeneratePIN(8); // Generate a random 8 digit password and hash it

        await User.findByIdAndUpdate(id, { password: hashedPassword });

        // send email to user
        await Mail.RESETPASSWORDMAIL({ name: user.name, email: user.email, password, role: "Admin" }, (info: any) => {
            res.status(200).json({
                success: true,
                message: "Password reset successfully"
            });
        });

    } catch (error) {
        next(error);
    }


}