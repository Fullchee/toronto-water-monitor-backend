import nodemailer from "nodemailer";
import { getEmailMessage } from "./email-messages";
import { Day } from "../types";
import { deleteAccount } from "../psql/db-operations";

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendWelcomeMail(toAddress: string) {
  transporter.sendMail(
    {
      from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
      to: toAddress,
      subject: "Confirm your email (Toronto water monitor)",
      text: getEmailMessage({}, "text", "welcome"),
      html: getEmailMessage({}, "html", "welcome"),
    },
    async (error, info) => {
      if (error) {
        console.error(error);
      }
      console.log(info);
      console.log("Sent email to " + toAddress);
    }
  );
}

export async function sendOveruseMail(toAddress: string, day: Day) {
  transporter
    .sendMail({
      from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
      to: toAddress,
      subject: "Potential water leak in your home",
      text: getEmailMessage({ day }, "text", "overuse"),
      html: getEmailMessage({ day }, "html", "overuse"),
    })
    .then((res) => {
      console.log("Sent email to " + toAddress);
    })
    .catch((err) => {
      console.error(err);
    });
}
