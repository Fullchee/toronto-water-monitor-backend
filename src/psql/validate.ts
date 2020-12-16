import { Account } from "../types";

export const isAccountValid = (account: Account) => {
  const conditions = [
    /^\d{9}-\d{9}-0\d$/.test(account.accountNumber),
    account.lastName.length > 0,
    account.paymentMethod >= 0 && account.paymentMethod <= 5,
    /^\w\d\w \d\w\d$/.test(account.postalCode),
    account.threshold > 0 && account.threshold < 100,
  ];
  return conditions.every((condition) => condition === true);
};

/**
 * Taken from https://github.com/manishsaraan/email-validator/blob/master/index.js
 */
export const isEmailValid = (email: string) => {
  var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;

  if (email.length > 256) return false;

  if (!tester.test(email)) return false;

  // Further checking of some things regex can't handle
  var emailParts = email.split("@");
  var account = emailParts[0];
  var address = emailParts[1];
  if (account.length > 64) return false;

  var domainParts = address.split(".");
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};
