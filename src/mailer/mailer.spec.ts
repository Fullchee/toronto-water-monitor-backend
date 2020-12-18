import { sendOveruseMail, sendWelcomeMail } from "./mailer";

require("dotenv").config();

describe("Sending mail tests", () => {
  test.skip("sendWelcomeMail", () => {
    sendWelcomeMail("fullchee@gmail.com");
  });
  test("sendOveruseMail", () => {
    sendOveruseMail("fullchee@gmail.com", {
      intStartDate: new Date().toString(),
      intConsumptionTotal: 4,
    });
  });
});
