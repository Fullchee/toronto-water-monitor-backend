import { sendOveruseMail, sendWelcomeMail } from "./mailer";

require("dotenv").config();

describe("Sending mail tests", () => {
  test("sendWelcomeMail", () => {
    sendWelcomeMail("fullchee@gmail.com", {
      account: {
        accountNumber: "000000000-000000000-00",
        lastName: "last name",
        paymentMethod: 4,
        postalCode: "M4M1M1",
        threshold: 3,
      },
      email: "fullchee@gmail.com",
    });
  });
  test.skip("sendOveruseMail", () => {
    sendOveruseMail("fullchee@gmail.com", {
      day: {
        intConsumptionTotal: 4,
        intStartDate: new Date(),
      },
      email: "fullchee@gmail.com",
    });
  });
});
