"use strict";
import { config as envConfig } from "dotenv";
import nodemailer, { TransportOptions } from "nodemailer";

envConfig();

export type EmailInfo = {
    messageId: string;
    accepted: string[];
    rejected: string[];
};

let transporter = nodemailer.createTransport({
    host: process.env.emailhost,
    port: process.env.emailport,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.emailuser,
        pass: process.env.emailpass,
    },
} as TransportOptions);

// let transporter = nodemailer.createTransport({
//     host: "smtp.office365.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'shcarp-aavc@outlook.com', 
//       pass: 'sunhui1314.', 
//     },
//   });

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<EmailInfo> {
    try {
        let info = await transporter.sendMail({
            from: `"Fred Foo 👻" <${process.env.emailuser}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html, // html body
        });
        return info as EmailInfo;
    } catch (error) {
        return Promise.reject(error);
    }
}
