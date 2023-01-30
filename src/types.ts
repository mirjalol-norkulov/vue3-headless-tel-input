import type { CountryCode } from "libphonenumber-js";

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, unknown>;
  };
  code: CountryCode;
  flag: string;
  callingCode: string;
}
