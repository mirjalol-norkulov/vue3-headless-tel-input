<script setup lang="ts">
  import { ref } from "vue"
import { useTelInput } from "../src/index"
const input = ref()
const initialValue = ref()
const { value } = useTelInput(input, initialValue)
</script>

<input ref="input" />
<button @click="initialValue = '+998931067337'">Change value</button>

# Vue 3 headless tel input docs

## Installation

With npm

```npm install vue3-headless-tel-input```

With yarn

`yarn add vue3-headless-tel-input`


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