import { sendOveruseMail, sendWelcomeMail } from "./mailer";

require("dotenv").config();

console.log(process.env);

sendWelcomeMail("fullchee@gmail.com", {
  account: {
    email: "fullchee@gmail.com",
    accountNumber: "my account number",
    lastName: "last name",
    paymentMethod: 4,
    postalCode: "M4M1M1",
    threshold: 3,
  },
});

sendOveruseMail("fullchee@gmail.com", {
  day: {
    intConsumptionTotal: 4,
    intStartDate: new Date(),
  },
  email: "fullchee@gmail.com",
});
