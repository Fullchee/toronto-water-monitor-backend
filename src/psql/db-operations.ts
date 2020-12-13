import { pool } from "./psql-pool";

interface Account {
  accountName: string;
  accountNumber: string;
  email: string;
  paymentMethod: number;
  postalCode: string;
}

export const createAccount = ({
  accountName,
  accountNumber,
  email,
  paymentMethod,
  postalCode,
}: Account): Promise<string> => {
  return new Promise(function (resolve, reject) {
    console.log("Account number", accountNumber);
    pool.query(
      "INSERT INTO account (accountNumber, accountName, email, paymentMethod, postalCode) VALUES ($1, $2, $3, $4, $5)",
      [accountNumber, accountName, email, paymentMethod, postalCode],
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
