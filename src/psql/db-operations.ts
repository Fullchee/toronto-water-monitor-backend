import { pool } from "./psql-pool";
import { Account } from "../types";

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const result = await pool.query(
      "SELECT * FROM account INNER JOIN email ON account.email_id=email.id"
    );
    return result.rows.map((a: any) => {
      return {
        accountNumber: a.account_number,
        lastName: a.last_name,
        paymentMethod: parseFloat(a.payment_method),
        postalCode: a.postal_code,
        threshold: a.threshold,
      };
    });
  } catch (error) {
    console.log(error.detail);
    console.log("Couldn't select from the database.");
    return error;
  }
};

export const getAccountEmails = async (
  accountNumber: string
): Promise<string[]> => {
  try {
    const result = await pool.query(
      `SELECT email 
      FROM account_email
      WHERE account_number=$1`,
      [accountNumber]
    );
    console.log("--------Emails:", result);
    return result.rows;
  } catch (error) {
    console.error("Couldn't get the account emails");
    console.log(error);
    return [];
  }
};
export const createAccount = async (
  { accountNumber, lastName, paymentMethod, postalCode, threshold }: Account,
  email: string
): Promise<string> => {
  try {
    await pool.query(
      `INSERT INTO account (account_number, last_name, payment_method, postal_code, threshold) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT DO NOTHING`,
      [accountNumber, lastName, paymentMethod, postalCode, threshold || 3]
    );
    const result = await pool.query(
      `INSERT INTO account_email (email, account_number) VALUES ($1, $2)
    `,
      [email, accountNumber]
    );

    if (result.rowCount === 0) {
      return "You've already signed up. :)";
    }

    return "Account successfully created!";
  } catch (error) {
    // key already exists
    if (error.code === "23505") {
      console.log(error.detail);
      return "You already added your account.";
    } else {
      console.log("-----------Create Account error: ", error);
      console.log("Error detail: ", error.detail);
      return "You have valid information but your account couldn't be added. Create a new issue here: https://github.com/Fullchee/toronto-water-monitor-backend/issues";
    }
  }
};

export const deleteAccount = async (email: string): Promise<string> => {
  try {
    const result = await pool.query(
      `DELETE FROM email 
      WHERE email = $1
      RETURNING accountNumber`,
      [email]
    );
    if (result.rowCount === 0) {
      return "Your email isn't in the database :)";
    }
    console.log(result);
    for (const [accountNumber] of result.rows) {
      await pool.query(
        `DELETE FROM account
        WHERE NOT EXISTS (
          SELECT *
          FROM email
          WHERE account_number=$1
        )`
      );
    }
    return email;
  } catch (error) {
    console.error(error);
    return "Wasn't able to remove your email from the database. Create a new issue here: https://github.com/Fullchee/toronto-water-monitor-backend/issues";
  }
};
