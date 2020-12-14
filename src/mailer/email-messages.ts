import { JSDOM } from "jsdom";
import { Day, Account } from "../types";
import { readFileSync } from "fs";
import { resolve } from "path";

// TODO: learn TypeScript predicates and advanced union types, make changes in mailer.ts too!

export function getEmailMessage(
  data: any,
  format: "text" | "html",
  type: "welcome" | "overuse"
) {
  const messages: { welcome: any; overuse: any } = {
    welcome: () => {
      return readFileSync(resolve(__dirname, "welcomeEmail.html"), "utf8")
        .replace("${email}", data.account.email)
        .replace("${accountNumber}", data.account.accountNumber)
        .replace("${lastName}", data.account.lastName)
        .replace("${paymentMethod}", data.account.paymentMethod)
        .replace("${postalCode}", data.account.postalCode)
        .replace("${threshold}", data.account.threshold);
    },

    overuse: () => {
      return readFileSync(resolve(__dirname, "overuseEmail.html"), "utf8")
        .replace("${usage}", data.day.intConsumptionTotal)
        .replace("${date}", data.day.intStartDate)
        .replace("${email}", data.email);
    },
  };

  if (format === "text") {
    const dom = new JSDOM(messages[type]());
    return dom.window.document.body.outerHTML;
  }
  return messages[type]();
}
