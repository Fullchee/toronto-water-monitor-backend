import { JSDOM } from "jsdom";
import { EmailData } from "../types";
import { readFileSync } from "fs";
import { resolve } from "path";

export function getEmailMessage(
  data: any,
  format: "text" | "html",
  type: "welcome" | "overuse"
) {
  const messages: { welcome: any; overuse: any } = {
    welcome: () => {
      return readFileSync(resolve(__dirname, "welcomeEmail.html"), "utf8");
    },

    overuse: () => {
      return readFileSync(resolve(__dirname, "overuseEmail.html"), "utf8")
        .replace("${usage}", data.day!.intConsumptionTotal + "")
        .replace("${date}", data.day!.intStartDate.toLocaleStringDate());
    },
  };

  if (format === "text") {
    const dom = new JSDOM(messages[type]());
    return dom.window.document.body.outerHTML;
  }
  return messages[type]();
}
