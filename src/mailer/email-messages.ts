import { JSDOM } from "jsdom";
import { Account, EmailData } from "../types";
import { readFileSync } from "fs";
import { resolve } from "path";
import {} from "jsonwebtoken";

// TODO: learn TypeScript predicates and advanced union types, make changes in mailer.ts too!
const createJwt = (account: Account, email: string) => {
  return "";
};

export function getEmailMessage(
  data: EmailData,
  format: "text" | "html",
  type: "welcome" | "overuse"
) {
  const messages: { welcome: any; overuse: any } = {
    welcome: () => {
      return readFileSync(
        resolve(__dirname, "welcomeEmail.html"),
        "utf8"
      ).replace("${jwt}", createJwt(data.account!, data.email));
    },

    overuse: () => {
      return readFileSync(resolve(__dirname, "overuseEmail.html"), "utf8")
        .replace("${usage}", data.day!.intConsumptionTotal + "")
        .replace("${date}", data.day!.intStartDate)
        .replace("${email}", data.email);
    },
  };

  if (format === "text") {
    const dom = new JSDOM(messages[type]());
    return dom.window.document.body.outerHTML;
  }
  return messages[type]();
}
