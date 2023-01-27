import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { ref } from "vue";

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, unknown>;
  };
  code: string;
  flag: string;
}

const fetchCountries = () => {
  return fetch("https://restcountries.com/v3/all?fields=flags,cca2,name").then(
    (response) => response.json()
  );
};

export const useCountries = () => {
  const availableCountries = getCountries();
  const countries = ref([]);

  fetchCountries().then((data) => {
    countries.value = data
      .filter((country: any) => availableCountries.includes(country.cca2))
      .map((country: any) => ({
        name: country.name,
        code: country.cca2,
        flag: country.flags[0],
        callingCode: "+" + getCountryCallingCode(country.cca2.toUpperCase()),
      }));
  });

  return countries;
};
