import nodemailer from "nodemailer";
import { getEmailMessage } from "./email-messages";
import { EmailData } from "../types";
require("dotenv").config();
import { sign } from "jsonwebtoken";
import { Account } from "../types";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

function generateAccessToken(account: Account, email: string) {
  // expires after half and hour (1800 seconds = 30 minutes)
  return sign(
    {
      account,
      email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1800s" }
  );
}

export async function sendWelcomeMail(
  toAddress: string,
  { account, email }: { account: Account; email: string }
) {
  const jwt = generateAccessToken(account, email);
  transporter
    .sendMail({
      from: '"Fullchee Zhang" <toronto.water.monitor@gmail.com>',
      to: toAddress,
      subject: "Confirm your email (Toronto water monitor)",
      text: getEmailMessage({ email, jwt }, "text", "welcome"),
      html: getEmailMessage({ email, jwt }, "html", "welcome"),
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
