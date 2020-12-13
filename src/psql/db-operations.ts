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
    pool.query(
      "INSERT INTO account (accountNumber, email, lastName, paymentMethod, postalCode) VALUES ($1, $2, $3, $4, $5)",
      [accountNumber, email, lastName, paymentMethod, postalCode],
      (error: any) => {
        if (error) {
          console.log(error);
          // key already exists
          console.log(error.code);
          if (error.code === "23505") {
            return reject("You already added your account.");
            console.log(error.detail);
          } else {
            console.log(error.detail);
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
  return new Promise(function (resolve, reject) {
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
