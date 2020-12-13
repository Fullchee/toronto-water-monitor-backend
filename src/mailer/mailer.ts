import nodemailer from "nodemailer";
import { getEmailMessage } from "./email-messages";
require("dotenv").config();

interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  [x: string]: any;
}

interface MessageOptions {
  day: Day;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendMail(toAddress: string, options: MessageOptions) {
  await transporter.sendMail({
    from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
    to: toAddress,
    subject: "Potential water leak",
    text: "Plaintext version of the message",
    html: getEmailMessage("overuse", "html", options.day),
  });
}
