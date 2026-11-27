<script setup lang="ts">
import type { Note } from '../../types/notes'

const props = defineProps({
  note: { type: Object as () => Note, required: true },
})

const emit = defineEmits(['edit', 'delete', 'open'])
</script>

<template>
  <article
    class="note-card"
    :data-note-id="props.note.id"
    :aria-labelledby="`note-title-${props.note.id}`"
  >
    <h3 :id="`note-title-${props.note.id}`" class="note-card__title">
      {{ props.note.title }}
    </h3>
    <p class="note-card__content">{{ props.note.content }}</p>
    <div class="note-card__actions">
      <button
        type="button"
        class="btn btn--secondary btn--sm"
        :aria-label="`打开笔记：${props.note.title}`"
        @click="emit('open', props.note.id)"
      >
        打开
      </button>
      <button
        type="button"
        class="btn btn--ghost btn--sm"
        :aria-label="`编辑笔记：${props.note.title}`"
        @click="emit('edit', props.note.id)"
      >
        编辑
      </button>
      <button
        type="button"
        class="btn btn--danger btn--sm"
        :aria-label="`删除笔记：${props.note.title}`"
        @click="emit('delete', props.note.id)"
      >
        删除
      </button>
    </div>
  </article>
</template>
