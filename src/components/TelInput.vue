<script setup lang="ts">
import { watch, toRef } from "vue";
import { useTelInput } from "..";

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
});
const emit = defineEmits(["update:model-value"]);

const value = toRef(props, "modelValue");

const { inputRef, unmaskedValue, countries, selectedCountry } =
  useTelInput(value);

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
    <input ref="inputRef" class="tel-input" />
  </div>
</template>

<style>
.tel-input {
  padding: 1rem;
  height: 36px;
  border: solid 1px lightgray;
  border-radius: 0.5rem;
}
</style>
