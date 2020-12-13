import { pool } from "./psql-pool";

interface Account {
  accountNumber: string;
  email: string;
  lastName: string;
  paymentMethod: number;
  postalCode: string;
}

export const createAccount = ({
  accountNumber,
  email,
  lastName,
  paymentMethod,
  postalCode,
}: Account): Promise<string> => {
  return new Promise(function (resolve, reject) {
    console.log("Account number", accountNumber);
    pool.query(
      "INSERT INTO account (accountNumber, email, lastName, paymentMethod, postalCode) VALUES ($1, $2, $3, $4, $5)",
      [accountNumber, email, lastName, paymentMethod, postalCode],
      (error) => {
        if (error) {
          reject(error);
        }
        return resolve(email);
      }
    );
  });
};

export const deleteAccount = (email: string): Promise<string> => {
  return new Promise(function (resolve, reject) {
    pool.query("DELETE FROM account WHERE email = $1", [email], (error) => {
      if (error) {
        reject(error);
      }
      return resolve(email);
    });
  });
};
