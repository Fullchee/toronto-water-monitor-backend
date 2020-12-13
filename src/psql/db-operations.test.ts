import { addAccount, deleteEmail } from "./db-operations";

require("dotenv").config();

describe("db-operations tests", () => {
  test("do this", async () => {
    expect(
      await addAccount({
        accountNumber: process.env.WATER_ACCOUNT_NUMBER,
        accountName: process.env.WATER_LAST_NAME,
        paymentMethod: parseInt(process.env.WATER_LAST_PAYMENT_METHOD),
        postalCode: process.env.WATER_POSTAL_CODE,
        email: "email@example.com",
      })
    ).toEqual("email@example.com");
  });
});
