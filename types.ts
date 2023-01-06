export interface MailUser {
    name: string;
    email: string;
    password: string;
    role: string;
    site?: string;
}

export interface MailData {
    name: string;
    email: string;
    subject: string;
    message: string;
    htmlText?: string;
}