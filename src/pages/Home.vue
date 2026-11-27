<script setup lang="ts">
import { useNotesStore } from '../stores/notes'
import { useToast } from '../composables/useToast'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import NoteListContainer from '../components/containers/NoteListContainer.vue'

const store = useNotesStore()
store.init()
const toast = useToast()

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
    <div class="page__head">
      <h1 class="page__title">笔记</h1>
      <p class="page__subtitle">浏览、创建与编辑你的笔记，支持搜索与筛选。</p>
    </div>
    <NoteListContainer />
    <ConfirmDialog
      :open="!!store.deleteTarget"
      title="删除笔记"
      :message="`确定删除该笔记吗？此操作不可撤销。`"
      confirm-text="确认删除"
      cancel-text="取消"
      @confirm="onConfirmDelete"
      @cancel="onCancelDelete"
    />
  </div>
</template>
