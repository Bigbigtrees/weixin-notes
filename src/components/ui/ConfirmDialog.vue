<script setup lang="ts">
import Modal from './Modal.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Modal
    :model-value="props.open"
    :title="props.title"
    @update:model-value="(value: boolean) => { if (!value) emit('cancel') }"
    @close="emit('cancel')"
  >
    <p class="dialog__message" role="status">{{ props.message }}</p>
    <div class="dialog__actions">
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">{{ props.cancelText }}</button>
      <button type="button" class="btn btn--danger" @click="emit('confirm')">{{ props.confirmText }}</button>
    </div>
  </Modal>
</template>
