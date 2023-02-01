import { computed, ref, watch, type Ref, isRef } from "vue";
import IMask from "imask";
import { unrefElement } from "@vueuse/core";
import {
  AsYouType,
  CountryCode,
  getCountryCallingCode,
  parsePhoneNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

import { getCountry, getInputEl } from "./utils";
import { Country } from "./types";
import countries from "./countries.json";
export * from "./types";

export interface UseTelInputOptions {
  onUpdate?: (
    unmaskedValue: string | undefined,
    value: string | undefined
  ) => void;
}

export const useTelInput = (
  target: Ref<HTMLElement | HTMLInputElement | undefined | null>,
  initialValue?: Ref<string | undefined> | string,
  options?: UseTelInputOptions
) => {
  // Imask InputMask instance
  let maskInstance: IMask.InputMask<any> | null = null;

  // Current selected country
  const selectedCountry = ref<CountryCode>(
    (getCountry() || "UZ") as CountryCode
  );

  const selectedCountryObject = computed<Country | undefined | null>(
    () =>
      countries.find((c: any) => c.code === selectedCountry.value) as
        | Country
        | undefined
  );

  // Calling code of the country, sucha s +998 for UZB
  const countryCallingCode = computed(() =>
    getCountryCallingCode(selectedCountry.value)
  );

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
      setTimeout(() => {
        if (options?.onUpdate) {
          options.onUpdate(unmaskedValue.value, value.value);
        }
      }, 0);
    });

    return maskInstance;
  };

  // call init function when input elements will be available using watch
  watch(
    () => unrefElement(target),
    (element) => {
      if (element) {
        initTelInput(element);
        setTimeout(() => {
          if (isRef(initialValue)) {
            watch(
              initialValue,
              () => {
                updateValue(initialValue.value);
              },
              { immediate: true }
            );
          } else {
            updateValue(initialValue);
          }
        }, 0);
      }
    }
  );

  // Re initialize mask when country changes
  watch(selectedCountry, () => {
    if (target.value) {
      if (maskInstance) {
        resetValues();
        maskInstance.updateValue();
      }

      if (maskInstance) {
        maskInstance.destroy();
      }
      initTelInput(target.value);
    }
  });

  const updateValue = (value: string | undefined) => {
    if (maskInstance) {
      if (value) {
        try {
          const parsed = parsePhoneNumber(value);
          if (parsed && parsed.nationalNumber && parsed.country) {
            selectedCountry.value = parsed.country;

            const masked = IMask.createMask({
              mask: maskString.value,
            });

            const maskedValue = masked.resolve(parsed.nationalNumber);

            setTimeout(() => {
              if (maskInstance) {
                maskInstance.value = maskedValue;
                maskInstance.unmaskedValue = parsed.nationalNumber;
                maskInstance.updateValue();
                updateValues();
              }
            }, 0);
          }
        } catch (e: any) {
          console.log(e.message);
        }
      } else {
        maskInstance.value = "";
        maskInstance.unmaskedValue = "";
        maskInstance.updateValue();
        updateValues();
      }
    }
  };

  return {
    countries,
    value,
    unmaskedValue,
    selectedCountry,
    selectedCountryObject,
    updateValue,
  };
};
