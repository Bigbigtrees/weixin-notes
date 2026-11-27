<script setup lang="ts">
const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="btn"
    :class="`btn--${props.variant}`"
    :class="`btn--${props.size}`"
    :disabled="props.disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
