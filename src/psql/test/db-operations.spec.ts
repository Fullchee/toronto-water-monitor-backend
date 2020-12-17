import { getAccountEmails, getAccounts, createAccount } from "../db-operations";
import { execSync } from "child_process";

function initializeDatabase() {
  execSync(`psql toronto_water_monitor -f init.sql`);
}

function clearDatabase() {
  execSync(`psql toronto_water_monitor -c "TRUNCATE account_email, account;" `);
}

function areArraysEqual(array1: any[], array2: any[]) {
  return array1.sort().join(",") === array2.sort().join(",");
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
    expect(emptyResult.length).toBe(0);

    await createAccount(
      {
        accountNumber: "000000000-000000000-00",
        lastName: "lastName",
        paymentMethod: 4,
        postalCode: "M1M 1M1",
        threshold: 3,
      },
      "email@email.com"
    );
    const oneResult = await getAccounts();
    expect(oneResult.length).toBe(1);
    expect(oneResult[0].lastName).toBe("lastName");
  });

  test("getAccountEmails", async () => {
    const emptyResult = await getAccountEmails("000000000-000000000-00");
    expect(emptyResult.length).toBe(0);

    await createAccount(
      {
        accountNumber: "000000000-000000000-00",
        lastName: "lastName",
        paymentMethod: 4,
        postalCode: "M1M 1M1",
        threshold: 3,
      },
      "email@email.com"
    );
    const oneResult = await getAccountEmails("000000000-000000000-00");
    expect(oneResult.length).toBe(1);
    expect(oneResult[0]).toBe("email@email.com");

    await createAccount(
      {
        accountNumber: "000000000-000000000-00",
        lastName: "lastName",
        paymentMethod: 4,
        postalCode: "M1M 1M1",
        threshold: 3,
      },
      "email2@email.com"
    );

    const twoEmails = await getAccountEmails("000000000-000000000-00");
    expect(twoEmails.length).toBe(2);
    expect(
      areArraysEqual(twoEmails, ["email@email.com", "email2@email.com"])
    ).toBe(true);
  });
});