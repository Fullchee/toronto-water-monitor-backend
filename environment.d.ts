declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WATER_ACCOUNT_NUMBER: string;
      WATER_LAST_NAME: string;
      WATER_POSTAL_CODE: string;
      WATER_LAST_PAYMENT_METHOD: string;

      SENDGRID_API_KEY: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
