<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  labelledBy: { type: String, default: 'modal-title' },
  closeOnBackdrop: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close'])

const panel = ref(!!props.modelValue)
let tracked = false

function focusable(): HTMLElement | null {
  return (
    document.querySelector('.modal')?.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? null
  )
}

function focusFirst(): void {
  focusable()?.focus()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('update:modelValue', false)
    return
  }
  if (event.key !== 'Tab') return
  const modal = document.querySelector('.modal')
  if (!modal) return
  const focusables = modal.querySelectorAll<HTMLElement>(
    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function onBackdropClick(): void {
  if (props.closeOnBackdrop) emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (value) => {
    panel.value = value
    if (value) {
      if (!tracked) {
        tracked = true
        document.addEventListener('keydown', onKeydown)
      }
      void nextTick(focusFirst)
    } else {
      tracked = false
      document.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  tracked = false
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div v-show="panel" class="modal-backdrop" @click.self="onBackdropClick" tabindex="-1" role="presentation">
    <div
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <h2 id="modal-title" class="modal__title">{{ props.title }}</h2>
      <div class="modal__body">
        <slot />
      </div>
    </div>
  </div>
</template>
