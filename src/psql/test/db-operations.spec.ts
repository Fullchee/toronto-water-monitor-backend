import { getAccountEmails, getAccounts, createAccount } from "../db-operations";
import { execSync } from "child_process";
import { sendOveruseMail, sendWelcomeMail } from "../../mailer/mailer";

function initializeDatabase() {
  execSync(`psql toronto_water_monitor -f init.sql`);
}

function clearDatabase() {
  execSync(`psql toronto_water_monitor -c "TRUNCATE account_email, account;" `);
}

function areArraysEqual(array1: any[], array2: any[]) {
  return array1.sort().join(",") === array2.sort().join(",");
}

const account = {
  accountNumber: "000000000-000000000-00",
  lastName: "lastName",
  paymentMethod: 4,
  postalCode: "M1M 1M1",
  threshold: 3,
};

describe.skip("db operations tests", () => {
  beforeAll(() => {
    initializeDatabase();
  });

  beforeEach(() => {
    clearDatabase();
  });

  test("getAccounts", async () => {
    const emptyResult = await getAccounts();
    expect(emptyResult.length).toBe(0);

    await createAccount(account, "email@email.com");
    const oneResult = await getAccounts();
    expect(oneResult.length).toBe(1);
    expect(oneResult[0].lastName).toBe("lastName");
  });

  test("getAccountEmails", async () => {
    const emptyResult = await getAccountEmails(account.accountNumber);
    expect(emptyResult.length).toBe(0);

    await createAccount(account, "email@email.com");
    const oneResult = await getAccountEmails(account.accountNumber);
    expect(oneResult.length).toBe(1);
    expect(oneResult[0]).toBe("email@email.com");

    await createAccount(account, "email2@email.com");

    const twoEmails = await getAccountEmails(account.accountNumber);
    expect(twoEmails.length).toBe(2);
    expect(
      areArraysEqual(twoEmails, ["email@email.com", "email2@email.com"])
    ).toBe(true);
  });
});

describe.skip("Go through Gmail inbox and delete all invalid emails", () => {
  beforeAll(() => {
    initializeDatabase();
  });

  beforeEach(() => {
    clearDatabase();
  });

  const badEmail1 = "badEmail@aslkdjflasdfj.com";
  const badEmail2 = "anotherBadEmail@asidjflasjfdlkajsd.com";

  test("sending welcome email to bad email should delete that entry", async () => {
    await createAccount(account, badEmail1);
    await createAccount(account, badEmail2);
    const twoResults = await getAccountEmails(account.accountNumber);
    expect(twoResults.length).toBe(2);

    sendWelcomeMail(badEmail1);
    // TODO: cleanInbox()

    const oneEmail = await getAccountEmails(account.accountNumber);
    expect(oneEmail.length).toBe(1);
    const oneAccount = await getAccounts();
    expect(oneAccount.length).toBe(1);

    sendWelcomeMail(badEmail2);
    // TODO: cleanInbox()

    const noEmail = await getAccountEmails(account.accountNumber);
    expect(noEmail.length).toBe(0);
    const noAccount = await getAccounts();
    expect(noAccount.length).toBe(0);
  });
});
