import { MailData } from './../types';
import { MailUser } from "../types";

const Templates = {
    WelcomeTEXT: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `Hello ${name}! Thank you for choosing CrownCast. As a/an ${role} you can now login to your dashboard and start managing your events. Your password is: ${password} NB! This is a temporary password. Make sure to change your password after your first login for security reasons. Login here: ${site}/auth Regards, CrownCast Team`;
    },
    WelcomeHTML: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `
        Hello  <i>${name}</i>! <br/>
    
        Thank you for choosing CrownCast. <br/>    
        As a/an ${role} you can now login to your dashboard and start managing your events. <br/>
        Your password is: <b>${password}</b> <br/>
        <br/> <br/>
            
        NB! This is a temporary password. Make sure to change your password after your first login for security reasons. <br/> <br/>
    
        Login here: <a href="${site}/auth">${site}/auth</a>
    
        
        Regards,<br/>
        CrownCast Team`;
    },
    HTML: (data: MailData) => {
        const { name, email, subject, message } = data;
        return `
        <h3>Message from ${name}</h3>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
        `;
    }
};

export default Templates;