<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNotesStore } from '../stores/notes'
import { useToast } from '../composables/useToast'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const store = useNotesStore()
const toast = useToast()
const route = useRoute()

const noteId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const note = computed(
  () => store.notes.find((n) => n.id === noteId.value) ?? null,
)

function edit(): void {
  store.openEditor(noteId.value)
}

function remove(): void {
  if (note.value) {
    store.requestDelete(noteId.value)
  }
}

function onConfirmDelete(): void {
  store.confirmDelete()
  toast.show('已删除笔记', 'info')
}

function onCancelDelete(): void {
  store.clearDeleteTarget()
}
</script>

<template>
  <div class="page">
    <RouterLink to="/" class="back-link" aria-label="返回笔记列表">
      <span aria-hidden="true">←</span>
      返回笔记列表
    </RouterLink>

    <article v-if="note" class="note-detail" :aria-labelledby="`note-title-${note.id}`">
      <h1 :id="`note-title-${note.id}`" class="note-detail__title">{{ note.title }}</h1>
      <p class="note-detail__content">{{ note.content }}</p>
      <p class="note-detail__meta" aria-live="polite">
        分类：{{ note.category }} · 更新于 {{ note.updatedAt }}
      </p>
    </article>

    <div v-else class="empty-state">
      <p class="empty-state__title">笔记不存在</p>
      <p class="empty-state__hint">该笔记可能已被删除，返回列表查看其他笔记。</p>
      <RouterLink to="/" class="btn btn--primary">返回笔记列表</RouterLink>
    </div>

    <div v-if="note" class="page__actions">
      <button type="button" class="btn btn--secondary" @click="edit">编辑</button>
      <button type="button" class="btn btn--danger" @click="remove">删除</button>
    </div>

    <ConfirmDialog
      :open="!!store.deleteTarget"
      title="删除笔记"
      :message="`确定删除「${note?.title ?? ''}」吗？此操作不可撤销。`"
      confirm-text="确认删除"
      cancel-text="取消"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />
  </div>
</template>
