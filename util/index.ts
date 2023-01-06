import Mail from '../mail';
import { MailUser } from './../types';
const CreateError = (message: string, code: number) => {
    const error = new Error() as any;
    error.message = message;
    error.statusCode = code;
    return error;
}

const GeneratePIN = (length: number = 6) => {
    // generate random {length} digits PIN code
    let pin = "";
    for (let i = 0; i < length; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    return pin;
}

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