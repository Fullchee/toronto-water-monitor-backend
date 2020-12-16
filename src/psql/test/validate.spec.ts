import { isAccountValid } from "../validate";

describe("isAccountValid", () => {
  let validAccount = {
    accountNumber: "000000000-000000000-00",
    lastName: "lastName",
    paymentMethod: 4,
    postalCode: "M1M 1M1",
    threshold: 3,
  };
  test("validates a good account", () => {
    expect(isAccountValid(validAccount)).toBe(true);
  });
  test("no dashes in account number -> false", () => {
    expect(
      isAccountValid({ ...validAccount, accountNumber: "00000000000000000000" })
    ).toBe(false);
  });

  test("empty accountNumber => false", () => {
    expect(isAccountValid({ ...validAccount, accountNumber: "" })).toBe(false);
  });
  test("second last number must be 0 => false", () => {
    expect(
      isAccountValid({ ...validAccount, accountNumber: "00000000000000000010" })
    ).toBe(false);
  });
});
