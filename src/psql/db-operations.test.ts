import { createAccount, deleteAccount } from "./db-operations";

require("dotenv").config();

describe("db-operations tests", () => {
  test("do this", async () => {
    expect(
      await createAccount({
        accountNumber: process.env.WATER_ACCOUNT_NUMBER,
        email: "email@example.com",
        lastName: process.env.WATER_LAST_NAME,
        paymentMethod: parseFloat(process.env.WATER_LAST_PAYMENT_METHOD),
        postalCode: process.env.WATER_POSTAL_CODE,
      })
    ).toEqual("email@example.com");
  });
});
