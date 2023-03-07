# Vue 3 headless tel input docs

## Installation

With npm

```npm install vue3-headless-tel-input```

With yarn

`yarn add vue3-headless-tel-input`


[Official documentation](https://tel-input.netlify.app)

## Usage

Import composable give returned ref to the input

```ts
import { useTelInput } from "vue3-headless-tel-input"

const {
  inputRef, 
  countries, selectedCountry, selectedCountryObject, 
  value, unmaskedValue 
} = useTelInput(input)
```

Template part

```html
<template>
  <div>
    <select v-model="selectedCountry">
      <option v-for="country in countries" :key="country.code" :value="country.code">
        {{ country.callingCode }}
      </option>
    </select>
    <input ref="inputRef" />
  </div>
</template>
```

### Vue component example with v-model

```ts
<script setup>
import { toRef, watch } from "vue"
import { useTelInput } from "vue3-headless-tel-input"

const props = defineProps({
  modelValue: String,
  default: undefined
});
const emit = defineEmit(["update:model-value"])

const value = toRef(props, "modelValue");

const { inputRef, selectedCountry, selectedCountryObject, unmaskedValue } = useTelInput(value);

watch(unmaskedValue, () => {
  emit("update:model-value", unmaskedValue.value);
});
</script>
```

```html
<template>
  <div>
    <select v-for="country in countries" :key="country.code" v-model="selectedCountry">
      <option :value="country.code">
        {{ country.name.common }} {{ country.callingCode }}
      </option>
    </select>
    <input ref="inputRef" />
  </div>
</template>
```