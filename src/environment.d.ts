declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DATABASE: string;

      GMAIL_EMAIL: string;
      GMAIL_PASS: string;

      JWT_SECRET: string;

      NODE_ENV: "production" | "development";

      WATER_ACCOUNT_NUMBER: string;
      WATER_LAST_NAME: string;
      WATER_POSTAL_CODE: string;
      WATER_LAST_PAYMENT_METHOD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
