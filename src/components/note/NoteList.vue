<script setup lang="ts">
import type { NoteSummary } from '../../types/notes'
import NoteToolbar from './NoteToolbar.vue'
import NoteCard from './NoteCard.vue'

const props = defineProps({
  notes: { type: Array as () => NoteSummary[], default: () => [] },
  query: { type: String, default: '' },
  filter: { type: String, default: '全部' },
})

const emit = defineEmits(['search', 'filter', 'edit', 'delete', 'open'])
</script>

<template>
  <div class="note-list">
    <NoteToolbar
      :query="props.query"
      :filter="props.filter"
      @search="emit('search', $event)"
      @filter="emit('filter', $event)"
    />

    <p class="note-list__count" aria-live="polite">
      共 {{ props.notes.length }} 条笔记
    </p>

    <div v-if="props.notes.length === 0" class="empty-state">
      <p class="empty-state__title">暂无笔记</p>
      <p class="empty-state__hint">点击下方「新建」创建第一条笔记。</p>
      <button
        type="button"
        class="btn btn--primary"
        @click="emit('edit', 'new')"
      >
        新建笔记
      </button>
    </div>

    <ul v-else class="note-list__items">
      <li v-for="note in props.notes" :key="note.id" class="note-list__item">
        <NoteCard
          :note="note"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @open="emit('open', $event)"
        />
      </li>
    </ul>
  </div>
</template>
