import axios from "axios";
import { sendOveruseMail } from "../mailer/mailer";
import { Account, Day } from "../types";
import { getAccountEmails } from "../psql/db-operations";

require("dotenv").config();

interface Premise {
  meterList: Meter[];
  [x: string]: any;
}
interface Meter {
  miu: string;
  [x: string]: any;
}

export async function getRefToken(account: any): Promise<string> {
  const validateURL =
    "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/validate";
  try {
    const res: any = await axios({
      method: "post",
      url: validateURL,
      timeout: 4000,
      data: {
        API_OP: "VALIDATE",
        ACCOUNT_NUMBER: account.accountNumber,
        LAST_NAME: account.lastName,
        POSTAL_CODE: account.postalCode,
        LAST_PAYMENT_METHOD: account.paymentMethod + "",
      },
    });
    if (res.request.path === "/ext/error/something-went-wrong.html") {
      console.error("Unable to get refToken from toronto.ca!", account);
      return "";
    } else if (!res.data.validateResponse?.refToken) {
      console.log(res.request);
      console.log(
        "Unable to get refToken from toronto.ca but didn't get redirected"
      );
      return "";
    }
    return res.data.validateResponse.refToken;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export async function getWaterData(account: Account) {
  console.log(`Getting water data for: ${account.accountNumber}`);
  const refToken = await getRefToken(account);
  if (!refToken) {
    console.log("Unable to get ref token.");
  }
  const miuList = await getMIU(refToken);
  const consumptionURL =
    "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/consumption";

  miuList.forEach(async (miu) => {
    const {
      data: {
        summary: { intervalList },
      },
    } = await axios.get(consumptionURL, {
      params: {
        refToken,
        json: {
          API_OP: "CONSUMPTION",
          ACCOUNT_NUMBER: process.env.WATER_ACCOUNT_NUMBER,
          MIU_ID: miu,
          START_DATE: formatDate(daysAgo(8)),
          END_DATE: formatDate(daysAgo(8)),
          INTERVAL_TYPE: "Day",
        },
      },
    });
    intervalList.forEach(async (day: Day) => {
      console.log(day);
      const waterUsed = day.intConsumptionTotal;
      if (waterUsed >= account.threshold) {
        const emails = await getAccountEmails(account.accountNumber);
        emails.forEach((email) => {
          sendOveruseMail(email, day);
        });
      }
    });
  });
}

/**
 * @return {string[]} array of MIU
 */
async function getMIU(refToken: string): Promise<string[]> {
  const accountDetailsURL =
    "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/accountdetails";
  const {
    data: { premiseList },
  } = await axios.get(accountDetailsURL, {
    params: {
      refToken,
      json: {
        API_OP: "ACCOUNTDETAILS",
        ACCOUNT_NUMBER: process.env.WATER_ACCOUNT_NUMBER,
      },
    },
  });

  const miuList: string[] = [];
  premiseList.forEach((premise: Premise) => {
    premise.meterList.forEach((meter: Meter) => {
      miuList.push(meter.miu);
    });
  });
  return miuList;
}

function daysAgo(days: number): Date {
  const today = new Date();
  return new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
}

/**
 * @returns {string} - YYYY-MM-DD format
 */
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
