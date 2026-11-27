<script setup lang="ts">
import type { NoteCategory } from '../../types/notes'

const props = defineProps({
  query: { type: String, default: '' },
  filter: { type: String, default: '全部' },
})

const emit = defineEmits(['search', 'filter'])

const filterOptions: Array<{ value: string; label: string }> = [
  { value: '全部', label: '全部' },
  { value: '工作', label: '工作' },
  { value: '生活', label: '生活' },
  { value: '学习', label: '学习' },
]
</script>

<template>
  <div class="note-toolbar">
    <div class="note-toolbar__field">
      <label for="note-search-input" class="input__label">搜索笔记</label>
      <input
        id="note-search-input"
        type="text"
        class="input"
        :value="props.query"
        placeholder="按标题或内容搜索"
        aria-label="搜索笔记"
        @input="emit('search', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="note-toolbar__field">
      <label for="note-filter-input" class="input__label">筛选类型</label>
      <select
        id="note-filter-input"
        class="input"
        :value="props.filter"
        aria-label="筛选笔记类型"
        @change="emit('filter', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="option in filterOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>
