export interface MessageOptions {
  day: Day;
  messageType: "welcome" | "overuse";
}

export interface Day {
  intStartDate: string;
  intConsumptionTotal: number;
  [x: string]: any;
}
