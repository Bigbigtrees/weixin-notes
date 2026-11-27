<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  ariaInvalid: { type: Boolean, default: false },
  id: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event): void {
  const el = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', el.value)
}
</script>

<template>
  <div
    class="input"
    :class="{ 'input--invalid': props.ariaInvalid }"
  >
    <label
      v-if="props.ariaLabel"
      :for="props.id"
      class="input__label"
    >
      {{ props.ariaLabel }}
    </label>

    <input
      v-if="props.type === 'text'"
      :id="props.id"
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :aria-label="props.ariaLabel"
      :aria-invalid="props.ariaInvalid ? 'true' : undefined"
      @input="onInput"
    />
    <textarea
      v-else
      :id="props.id"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :aria-label="props.ariaLabel"
      :aria-invalid="props.ariaInvalid ? 'true' : undefined"
      rows="10"
      @input="onInput"
    />
  </div>
</template>
