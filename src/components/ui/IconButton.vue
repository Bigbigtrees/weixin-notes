<script setup lang="ts">
import { icons } from './icons'

const props = defineProps({
  icon: { type: String, default: 'edit' },
  ariaLabel: { type: String, default: '' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const iconSvg = () => icons[props.icon] ?? ''
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :class="`icon-button--${props.size}`"
    :disabled="props.disabled"
    :aria-label="props.ariaLabel || `操作（${props.icon}）`"
    @click="emit('click')"
  >
    <span class="icon-button__icon" aria-hidden="true" v-html="iconSvg()"></span>
  </button>
</template>
