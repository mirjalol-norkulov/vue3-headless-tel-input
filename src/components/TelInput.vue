<script setup lang="ts">
import { computed, ref, watch, onMounted, type Ref } from "vue";
import {
  AsYouType,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";
import IMask from "imask";
import examples from "libphonenumber-js/mobile/examples";
import { unrefElement } from "@vueuse/core";
import { useCountries } from "../composables/use-countries";

const country = ref<CountryCode>("UZ" as CountryCode);

const countryCallingCode = computed(() => getCountryCallingCode(country.value));

const useTelInput = (
  target: Ref<HTMLElement | HTMLInputElement | undefined | null>
) => {
  let mask: IMask.InputMask<any> | null = null;
  const countries = useCountries();
  const maskString = computed(() => {
    const asYouType: any = new AsYouType(country.value);
    const template = "+" + countryCallingCode.value + examples[country.value];
    asYouType.input(template);

    return asYouType.formatter.nationalNumberTemplate?.replaceAll("x", "0");
  });

  const initTelInput = (inputEl: HTMLElement | HTMLInputElement) => {
    const maskInstance = IMask(inputEl, {
      mask: maskString.value,
      lazy: false,
    });
    maskInstance.on("accept", () => {});
    return maskInstance;
  };
  watch(
    () => unrefElement(target),
    (element) => {
      if (element) {
        initTelInput(element);
      }
    }
  );
  watch(country, () => {
    if (mask) {
      mask.destroy();
    }
    if (target.value) {
      mask = initTelInput(target.value);
    }
  });

  return { countries, initTelInput };
};
</script>
<template>
  <div>TEST</div>
</template>
