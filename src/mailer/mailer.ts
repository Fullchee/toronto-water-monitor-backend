import nodemailer from "nodemailer";
import { getEmailMessage } from "./email-messages";
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendWelcomeMail(toAddress: string, data: any) {
  transporter
    .sendMail({
      from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
      to: toAddress,
      subject: "Confirm your email (Toronto water monitor)",
      text: getEmailMessage(data, "text", "welcome"),
      html: getEmailMessage(data, "html", "welcome"),
    })
    .then((res) => {
      console.log("Sent email to " + toAddress);
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function sendOveruseMail(toAddress: string, data: any) {
  transporter
    .sendMail({
      from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
      to: toAddress,
      subject: "Potential water leak in your home",
      text: getEmailMessage(data, "text", "overuse"),
      html: getEmailMessage(data, "html", "overuse"),
    })
    .then((res) => {
      console.log("Sent email to " + toAddress);
    })
    .catch((err) => {
      console.error(err);
    });
}
