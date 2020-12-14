export interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  [x: string]: any;
}

export interface Account {
  accountNumber: string;
  email: string;
  lastName: string;
  paymentMethod: number;
  postalCode: string;
  threshold: number;
}
