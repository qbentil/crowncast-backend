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
    
        Login here: <a href="${site}/auth">${site}/auth</a> <br/> <br/>
    
        <small>Kindly note that this is an automated email. Please do not reply to this email.</small>
        
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
    },

    ResetPasswordTEXT: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `Hello ${name}! 
        You have requested to reset your password.
        Your new password is: ${password}

        NB! Quickly change your password if you did not request this change and report this to us immediately.

        Login here: ${site}/auth

        Regards,
        CrownCast Team`;
    },
    ResetPasswordHTML: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `
        Hello  <i>${name}</i>! <br/>
    
        You have requested to reset your password. <br/>    
        Your new password is: <b>${password}</b> <br/>
        <br/> <br/>
            
        NB! Quickly change your password if you did not request this change and report this to us immediately. <br/> <br/>
    
        Login here: <a href="${site}/auth">${site}/auth</a>
    
        
        Regards,<br/>
        CrownCast Team`;
    },
    ChangePasswordTEXT: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `Hello ${name}! 
        You have successfully changed your password.
        Quickly report this to us if you did not request this change.

        Kindly note that this is an automated email. Please do not reply to this email.

        Login here: ${site}/auth

        Regards,
        CrownCast Team`;
    },
    ChangePasswordHTML: (user: MailUser) => {
        const { name, password, role, site } = user;
        return `
        Hello  <i>${name}</i>! <br/>
    
        You have successfully changed your password. <br/>    
        Quickly report this to us if you did not request this change. <br/>
        <br/> <br/>
            
        <small>Kindly note that this is an automated email. Please do not reply to this email.</small> <br/> <br/>
    
        Login here: <a href="${site}/auth">${site}/auth</a>
    
        
        Regards,<br/>
        CrownCast Team`;
    }
};

export default Templates;