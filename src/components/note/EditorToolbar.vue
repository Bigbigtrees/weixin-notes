<script setup lang="ts">
import Input from '../ui/Input.vue'

const props = defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  saving: { type: Boolean, default: false },
})

const emit = defineEmits(['update:title', 'update:content', 'save', 'cancel'])
</script>

<template>
  <div class="editor-toolbar">
    <Input
      :model-value="props.title"
      id="note-title-input"
      aria-label="笔记标题"
      placeholder="笔记标题"
      @update:modelValue="emit('update:title', $event)"
    />
    <Input
      :model-value="props.content"
      id="note-content-input"
      type="textarea"
      aria-label="笔记内容"
      placeholder="笔记内容"
      @update:modelValue="emit('update:content', $event)"
    />
    <div class="editor-toolbar__actions">
      <button
        type="button"
        class="btn btn--primary"
        :disabled="props.saving"
        @click="emit('save')"
      >
        {{ props.saving ? '保存中…' : '保存' }}
      </button>
      <button type="button" class="btn btn--ghost" @click="emit('cancel')">
        取消
      </button>
    </div>
  </div>
</template>
