import axios from "axios";
import { sendMail } from "../mailer/mailer";

require("dotenv").config();

interface Account {
  accountNumber: string;
  email: string;
  lastName: string;
  paymentMethod: number;
  postalCode: string;
}

interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  [x: string]: any;
}

interface Premise {
  meterList: Meter[];
  [x: string]: any;
}
interface Meter {
  miu: string;
  [x: string]: any;
}

export function getRefToken(data: Account): Promise<string> {
  return new Promise(async (resolve, reject) => {
    console.log("Getting water data");
    const validateURL =
      "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/validate";
    const {
      data: { validateResponse },
    } = await axios({
      method: "post",
      url: validateURL,
      timeout: 4000,
      data: {
        ACCOUNT_NUMBER: data.accountNumber,
        API_OP: "VALIDATE",
        LAST_NAME: data.lastName,
        POSTAL_CODE: data.postalCode,
        LAST_PAYMENT_METHOD: data.paymentMethod,
      },
    });
    if (!validateResponse || !validateResponse.refToken) {
      console.error("Request to get refToken failed!");
      reject();
    }
    resolve(validateResponse.refToken);
  });
}

export async function getWaterData() {
  // TODO: make this function accept dynamic data
  const validateBody: Account = {
    accountNumber: process.env.WATER_ACCOUNT_NUMBER!,
    email: "fullchee@gmail.com",
    lastName: process.env.WATER_LAST_NAME!,
    paymentMethod: parseInt(process.env.WATER_LAST_PAYMENT_METHOD!),
    postalCode: process.env.WATER_POSTAL_CODE!,
  };
  const refToken = await getRefToken(validateBody);
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
    intervalList.forEach((day: Day) => {
      console.log(day);
      const waterUsed = day.intConsumptionTotal;
      // TODO: make the 3 dynamic
      if (waterUsed >= 3) {
        sendMail("fullchee@gmail.com", { day: day });
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
