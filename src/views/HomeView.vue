<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import {testUsingGet} from "../api/mainController";

testUsingGet().then((res) => {
  console.log(res)
})
</script>

<template>
  <main>
    <TheWelcome />

  </main>
</template>
