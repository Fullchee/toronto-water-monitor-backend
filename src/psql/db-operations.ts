import { pool } from "./psql-pool";

interface Account {
  accountNumber: string;
  email: string;
  lastName: string;
  paymentMethod: number;
  postalCode: string;
  threshold: number;
}

export const getAccounts = (): Promise<Account[]> => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM account", (error: any, result: any) => {
      if (error) {
        console.log(error.detail);
        return reject("Unable to get accounts");
      }
      return resolve(
        result.rows.map((a: any) => {
          return {
            accountNumber: a.accountnumber,
            email: a.email,
            lastName: a.lastname,
            paymentMethod: parseInt(a.paymentmethod),
            postalCode: a.postalcode,
            threshold: a.threshold,
          };
        })
      );
    });
  });
};

export const createAccount = ({
  accountNumber,
  email,
  lastName,
  paymentMethod,
  postalCode,
  threshold,
}: Account): Promise<string> => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO account (accountNumber, email, lastName, paymentMethod, postalCode, threshold) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        accountNumber,
        email,
        lastName,
        paymentMethod,
        postalCode,
        threshold || 3,
      ],
      (error: any) => {
        if (error) {
          // key already exists
          if (error.code === "23505") {
            console.log(error.detail);
            return reject("You already added your account.");
          } else {
            console.log("Create Account error: ", error);
            console.log("Error detail: ", error.detail);
            return reject(
              "You have valid information but your account couldn't be added. Create a new issue here: https://github.com/Fullchee/toronto-water-monitor-backend/issues"
            );
          }
        }
        return resolve(email);
      }
    );
  });
};

export const deleteAccount = (email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    pool.query(
      "DELETE FROM account WHERE email = $1",
      [email],
      (error: any, result: any) => {
        if (error) {
          return reject(error.detail);
        } else if (result.rowCount === 0) {
          return reject("Your email isn't in the database :)");
        }
        return resolve(email);
      }
    );
  });
};
