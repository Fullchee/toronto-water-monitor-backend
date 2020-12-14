import { JSDOM } from "jsdom";
import { Day } from "../types";
import { readFileSync } from "fs";
import { resolve } from "path";

export function getEmailMessage(data: any, format: any, options: any) {
  const messages = {
    welcome: `Please click this button to confirm. Or, just ignore this email.`,

    overuse: readFileSync(resolve(__dirname, "overuseEmail.html"), "utf8").replace("")
  };

  // if (format === "text") {
  //   const dom = new JSDOM(messages[type]);
  //   return dom.window.document.body.outerHTML;
  // }
  // return messages[type];
}

getEmailMessage("", "", "");
