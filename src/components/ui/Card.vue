<script setup lang="ts">
const props = defineProps({
  variant: { type: String, default: 'default' },
})
</script>

<template>
  <div class="card" :class="`card--${props.variant}`">
    <slot />
  </div>
</template>
