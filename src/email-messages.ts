import { JSDOM } from "jsdom";
interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  [x: string]: any;
}

type MessageType = "overuse";
type EmailFormat = "html" | "text";

export async function getEmailMessage(
  type: MessageType,
  format: EmailFormat,
  day: Day
) {
  const messages = {
    welcome: `Please click this button to confirm. Or, just ignore this email.`,

    overuse: `Your house may have a water leak!
        
You've used around ${day.intConsumptionTotal + "000"} litres on ${new Date(
      day.intStartDate
    ).toLocaleDateString()}.

Here's Toronto's official website to get see more info
  
https://www.toronto.ca/services-payments/water-environment/how-to-use-less-water/mywatertoronto/mywater-toronto-application/

Click here to unsubscribe. // TODO:
`,
  };

  if (format === "text") {
    const dom = new JSDOM(messages[type]);
    return dom.window.document.body.outerHTML;
  }
  return messages[type];
}
