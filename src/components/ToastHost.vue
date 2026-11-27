<script setup lang="ts">
import { toasts } from '../composables/useToast'
</script>

<template>
  <div class="toast-host" role="status" aria-live="polite">
    <div
      v-for="item in toasts"
      :key="item.id"
      class="toast"
      :class="`toast--${item.type}`"
      role="alert"
      :data-toast-type="item.type"
    >
      {{ item.message }}
    </div>
  </div>
</template>
