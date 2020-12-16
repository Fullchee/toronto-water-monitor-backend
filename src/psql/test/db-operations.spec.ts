import { getAccountEmails, getAccounts, createAccount } from "../db-operations";
import { execSync } from "child_process";

function initializeDatabase() {
  execSync(`psql toronto_water_monitor -f init.sql`);
}

function clearDatabase() {
  execSync(`psql toronto_water_monitor -c "TRUNCATE account_email, account;" `);
}

describe("db operations tests", () => {
  beforeAll(() => {
    initializeDatabase();
  });

  beforeEach(() => {
    clearDatabase();
  });

  test("getAccounts", async () => {
    const emptyResult = await getAccounts();
    expect(emptyResult).toBe(undefined);

    createAccount(
      {
        accountNumber: "000000000-000000000-00",
        lastName: "lastName",
        paymentMethod: 4,
        postalCode: "M1M 1M1",
        threshold: 3,
      },
      "email@email.com"
    );
    // console.log("results");
  });
});
