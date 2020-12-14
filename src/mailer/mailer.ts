import nodemailer from "nodemailer";
import { getEmailMessage } from "./email-messages";
require("dotenv").config();
import { MailOptions } from "./mailTypes";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendMail(toAddress: string, data: any) {
  await transporter.sendMail({
    from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
    to: toAddress,
    subject: "Potential water leak",
    text: getEmailMessage(options.type, "text", data),
    html: getEmailMessage(options.type, "html", data),
  });
}
