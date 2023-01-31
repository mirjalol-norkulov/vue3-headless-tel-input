import { ref } from "vue";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import type { Country } from "../types";

const fetchCountries = () => {
  return fetch(
    "https://restcountries.com/v2/all?fields=name,alpha2Code,flag"
  ).then((response) => response.json());
};

export const useCountries = () => {
  const availableCountries = getCountries();
  const countries = ref<Country[]>([]);

  fetchCountries().then((data) => {
    countries.value = data
      .filter((country: any) => availableCountries.includes(country.alpha2Code))
      .map((country: any) => ({
        name: country.name,
        code: country.alpha2Code,
        flag: country.flag,
        callingCode:
          "+" + getCountryCallingCode(country.alpha2Code.toUpperCase()),
      }));
  });

  return countries;
};
