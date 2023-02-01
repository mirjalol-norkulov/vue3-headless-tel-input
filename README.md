# Vue 3 headless tel input docs

## Installation

With npm

```npm install vue3-headless-tel-input```

With yarn

`yarn add vue3-headless-tel-input`


[Official documentation](https://tel-input.netlify.app)

## Usage

Import composable and pass ref of the input element to the composable

```ts
import { ref } from "vue"
import { useTelInput } from "vue3-headless-tel-input"

const input = ref()
const { 
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
    <input ref="input" />
  </div>
</template>
```

### Vue component example with v-model

```ts
<script setup>
import { ref, toRef } from "vue"
import { useTelInput } from "vue3-headless-tel-input"

const props = defineProps({
  modelValue: String,
  default: undefined
});
const emit = defineEmit(["update:model-value"])

const value = toRef(props, "modelValue");

const inputEl = ref();

const { selectedCountry, selectedCountryObject, unmaskedValue, updateValue } = useTelInput(inputEl, value, { 
  onUpdate(unmaskedValue, value) {
    emit("update:model-value", unmaskedValue);
  }
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
    <input ref="inputEl" />
  </div>
</template>
```