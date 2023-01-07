import { MailData, MailUser } from "../types";
import Templates from "./templates";
import transporter from "./transport";

const OnboardingMail = async (user:MailUser, callback:any) => {
  // add site url to user object
  user.site = process.env.SITE_URL;
  const mailOptions = {
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ID}>`,
    to: user.email,
    subject: "Welcome to CrownCast👑",
    text: Templates.WelcomeTEXT(user),
    html: Templates.WelcomeHTML(user),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error:any) {
    throw new Error(error);
  }
};


// For testing the mailer function 
const SendMail = async (data:MailData, callback:any) => {
  const mailOptions = {
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ID}>`,
    to: data.email,
    subject: data.subject,
    text: data.message,
    html: Templates.HTML(data),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error :any) {
    throw new Error(error);
  }
}

const RESETPASSWORDMAIL = async (user:MailUser, callback:any) => {
  // add site url to user object
  user.site = process.env.SITE_URL;
  const mailOptions = {
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ID}>`,
    to: user.email,
    subject: "Reset Password on CrownCast👑",
    text: Templates.ResetPasswordTEXT(user),
    html: Templates.ResetPasswordHTML(user),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error:any) {
    throw new Error(error);
  }
}

const CHANGEPASSWORDMAIL = async (user:MailUser, callback:any) => {
  // add site url to user object
  user.site = process.env.SITE_URL;
  const mailOptions = {
    from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_ID}>`,
    to: user.email,
    subject: "Password Changed on CrownCast👑",
    text: Templates.ChangePasswordTEXT(user),
    html: Templates.ChangePasswordHTML(user),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error:any) {
    throw new Error(error);
  }
}

const CONTACTMAIL = async (data:MailData, callback:any) => {
  const mailOptions = {
    from: `${data.name} <${data.email}>`,
    to: process.env.EMAIL_ID,
    subject: data.subject,
    text: data.message,
    html: data.htmlText,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    callback(info);
  } catch (error:any) {
    throw new Error(error);
  }
};

const Mail = {
  OnboardingMail,
  SendMail,
  CONTACTMAIL,
  RESETPASSWORDMAIL,
  CHANGEPASSWORDMAIL,
}

export default Mail;

