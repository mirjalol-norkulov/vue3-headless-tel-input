import { computed, ref, watch, type Ref } from "vue";
import IMask from "imask";
import { unrefElement } from "@vueuse/core";
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

import { useCountries } from "./composables/use-countries";
import { getCountry } from "./utils";

export const useTelInput = (
  target: Ref<HTMLElement | HTMLInputElement | undefined | null>
) => {
  // Imask InputMask instance
  let mask: IMask.InputMask<any> | null = null;

  // Current selected country
  const country = ref<CountryCode>((getCountry() || "UZ") as CountryCode);

  const selectedCountryObject = computed(() =>
    countries.value.find((c: any) => c.code === country.value)
  );

  // Calling code of the country, sucha s +998 for UZB
  const countryCallingCode = computed(() =>
    getCountryCallingCode(country.value)
  );

  // List of countries with code, flags and name
  const countries = useCountries();

  // Mask for imask depending on country code
  const maskString = computed(() => {
    const asYouType: any = new AsYouType(country.value);
    const template = "+" + countryCallingCode.value + examples[country.value];
    asYouType.input(template);

    return asYouType.formatter.nationalNumberTemplate?.replaceAll("x", "0");
  });

  // Value of the input
  const value = ref<string | undefined>();

  // Unmasked value
  const unmaskedValue = ref<string | undefined>();

  // Initialize input with mask
  const initTelInput = (inputEl: HTMLElement | HTMLInputElement) => {
    const maskInstance = IMask(inputEl, {
      mask: maskString.value,
      lazy: false,
    });
    maskInstance.on("accept", () => {
      value.value = "+" + countryCallingCode.value + " " + maskInstance.value;
      unmaskedValue.value =
        "+" + countryCallingCode.value + maskInstance.unmaskedValue;
    });
    return maskInstance;
  };

  // call init function when input elements will be available using watch
  watch(
    () => unrefElement(target),
    (element) => {
      if (element) {
        initTelInput(element);
      }
    }
  );

  // Re initialize mask when country changes
  watch(country, () => {
    if (mask) {
      mask.destroy();
    }
    if (target.value) {
      mask = initTelInput(target.value);
    }
  });

  return { countries, value, unmaskedValue, country, selectedCountryObject };
};
