import { getWaterData } from "./toronto-water";
import { getAccounts } from "../psql/db-operations";

const checkAllAccounts = async () => {
  const accounts = await getAccounts();
  accounts.forEach(getWaterData);
};

checkAllAccounts();
