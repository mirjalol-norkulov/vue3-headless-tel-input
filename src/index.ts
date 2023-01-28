import { computed, ref, unref, watch, type Ref } from "vue";
import IMask from "imask";
import { unrefElement } from "@vueuse/core";
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

import { useCountries } from "./composables/use-countries";
import { getCountry, getInputEl } from "./utils";

export const useTelInput = (
  target: Ref<HTMLElement | HTMLInputElement | undefined | null>,
  initialValue?: Ref<string | null | undefined> | string | null | undefined
) => {
  const isWatcherSetForInitialValue = ref(false);
  // Imask InputMask instance
  let maskInstance: IMask.InputMask<any> | null = null;

  // Current selected country
  const selectedCountry = ref<CountryCode>(
    (getCountry() || "UZ") as CountryCode
  );

  const selectedCountryObject = computed(() =>
    countries.value.find((c: any) => c.code === selectedCountry.value)
  );

  // Calling code of the country, sucha s +998 for UZB
  const countryCallingCode = computed(() =>
    getCountryCallingCode(selectedCountry.value)
  );

  // List of countries with code, flags and name
  const countries = useCountries();

  // Mask for imask depending on country code
  const maskString = computed(() => {
    const asYouType: any = new AsYouType(selectedCountry.value);
    const template =
      "+" + countryCallingCode.value + examples[selectedCountry.value];
    asYouType.input(template);

    return asYouType.formatter.nationalNumberTemplate?.replaceAll("x", "0");
  });

  // Value of the input
  const value = ref<string | undefined>();

  // Unmasked value
  const unmaskedValue = ref<string | undefined>();

  const resetValues = () => {
    value.value = "";
    unmaskedValue.value = "";
  };

  const updateValues = () => {
    if (maskInstance) {
      value.value = "+" + countryCallingCode.value + " " + maskInstance?.value;
      unmaskedValue.value =
        "+" + countryCallingCode.value + maskInstance?.unmaskedValue;
    }
  };

  // Initialize input with mask
  const initTelInput = (element: HTMLElement) => {
    const inputEl = getInputEl(element);
    if (!inputEl) {
      throw new Error("Input element not found");
    }
    maskInstance = IMask(inputEl, {
      mask: maskString.value,
      lazy: false,
    });
    maskInstance.on("accept", () => {
      updateValues();
    });

    if (!isWatcherSetForInitialValue.value) {
      // Watch given initial value and update value of the mask
      watch(
        () => unref(initialValue),
        (val: any) => {
          if (maskInstance && val) {
            const parsed = parsePhoneNumber(val);
            if (parsed && parsed.nationalNumber && parsed.country) {
              selectedCountry.value = parsed.country;
              maskInstance.value = parsed.nationalNumber;
              updateValues();
            }
          }
        },
        { immediate: true }
      );
    }
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
  watch(selectedCountry, () => {
    if (target.value) {
      const inputEl = getInputEl(target.value);
      if (inputEl) {
        inputEl.value = "";
        resetValues();

        if (maskInstance) {
          maskInstance.value = "";
          maskInstance.unmaskedValue = "";
          maskInstance.updateValue();
        }
      }
      if (maskInstance) {
        maskInstance.destroy();
      }
      initTelInput(target.value);
    }
  });

  return {
    countries,
    value,
    unmaskedValue,
    selectedCountry,
    selectedCountryObject,
  };
};
