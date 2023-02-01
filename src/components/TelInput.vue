<script setup lang="ts">
import { ref, watch, toRef } from "vue";
import { useTelInput } from "..";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
});
const emit = defineEmits(["update:model-value"]);

const value = toRef(props, "modelValue");
const input = ref();

const { unmaskedValue, countries, selectedCountry, updateValue } = useTelInput(
  input,
  value
);

watch(unmaskedValue, () => {
  emit("update:model-value", unmaskedValue.value);
});
</script>

<template>
  <div>
    <p>{{ unmaskedValue }}</p>
    <select v-model="selectedCountry">
      <option
        v-for="country in countries"
        :key="country.code"
        :value="country.code"
      >
        {{ country.name }} {{ country.callingCode }}
      </option>
    </select>
    <input ref="input" />
  </div>
</template>
