import type { CountryCode } from "libphonenumber-js";

export interface Country {
  name: string;
  code: CountryCode;
  flag: string;
  callingCode: string;
}
