<template>ERROR</template>
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})


onMounted(() => {
    console.log('Error page mounted');
    if (props.error?.statusCode != 500) return;
    window.location.href = window.location.href;
});
</script>