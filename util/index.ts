import Mail from '../mail';
import { MailUser } from './../types';

import bcrypt from 'bcrypt';
export const CreateError = (code: number, message: string,) => {
    const error = new Error() as any;
    error.message = message;
    error.statusCode = code;
    return error;
}


export const GeneratePIN:any = async (length: number = 6) => {
    // generate random {length} digits PIN code
    let pin = "";
    for (let i = 0; i < length; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    const { password, hashedPassword } = await BcryptPassword(pin);
    return {
        password,
        hashedPassword
    }
}

export const BcryptPassword = async (password: string) => {
    // encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
        password,
        hashedPassword
    }
}

export const ComparePassword = async (password: string, hashedPassword: string) => {
    // compare password with hashed password
    return await bcrypt.compare(password, hashedPassword);
}

// console.log(GeneratePIN(8, BcryptPassword));

// const User:MailUser = {
//     name: "Shadrack Bentil",
//     email: "bentilshadrack72@gmail.com",
//     password: GeneratePIN(),
//     role: "Organizer",
//     site: "https://voting-app-frontend.herokuapp.com",
// }

// Mail.OnboardingMail(User, (info: any) => {
//     console.log(info);
// })