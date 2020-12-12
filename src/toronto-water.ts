import axios from "axios";

require("dotenv").config();

interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  intConsumptionMin: number;
  intConsumptionMax: number;
  intConsumptionAvg: number;
}

interface Premise {
  meterList: Meter[];
  [x: string]: any;
}
interface Meter {
  miu: string;
  [x: string]: any;
}

const validateURL =
  "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/validate";
const consumptionURL =
  "https://secure.toronto.ca/cc_api/svcaccount_v1/WaterAccount/consumption";

const validateBody = {
  API_OP: "VALIDATE",
  ACCOUNT_NUMBER: process.env.WATER_ACCOUNT_NUMBER,
  LAST_NAME: process.env.WATER_LAST_NAME,
  POSTAL_CODE: process.env.WATER_POSTAL_CODE,
  LAST_PAYMENT_METHOD: process.env.WATER_LAST_PAYMENT_METHOD,
};

export async function getWaterData() {
  const {
    data: {
      validateResponse: { refToken },
    },
  } = await axios({
    method: "post",
    url: validateURL,
    timeout: 4000,
    data: validateBody,
  });
  const miuList = await getMIU(refToken);

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
      const waterUsed = day.intConsumptionTotal;
      if (waterUsed >= 3) {
        // TODO: what do I do with the water usage data?
        console.log(day);
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
