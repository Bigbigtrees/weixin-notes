<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes'
import { useToast } from '../composables/useToast'
import EditorToolbar from '../components/note/EditorToolbar.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'

const store = useNotesStore()
const toast = useToast()
const router = useRouter()

const title = ref('')
const content = ref('')
const saving = ref(false)
const showDeleteConfirm = ref(false)

const isEdit = computed(() => !!store.selectedId && store.selectedId !== 'new')

watch(
  () => store.selectedId,
  (id) => {
    title.value = ''
    content.value = ''
    if (id && id !== 'new') {
      title.value = store.draftTitle
      content.value = store.draftContent
    }
  },
  { immediate: true },
)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function scheduleSave(): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => save(), 2000)
}

function save(): void {
  if (!title.value.trim() && !content.value.trim()) {
    toast.show('请输入笔记标题与内容', 'error')
    return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      store.updateNote(store.selectedId!, {
        title: title.value.trim(),
        content: content.value,
      })
    } else {
      store.createNote(title.value, content.value)
    }
    toast.show('已保存', 'success')
  } finally {
    saving.value = false
    scheduleSave()
  }
}

watch(() => [title.value, content.value], scheduleSave, { deep: true })

function onTitle(value: string): void {
  title.value = value
}

function onContent(value: string): void {
  content.value = value
}

function onSave(): void {
  save()
}

function onCancel(): void {
  router.push('/')
}

function requestDelete(): void {
  showDeleteConfirm.value = true
}

function confirmDelete(): void {
  if (store.selectedId) store.removeNote(store.selectedId)
  toast.show('已删除笔记', 'info')
  router.push('/')
  showDeleteConfirm.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.ctrlKey || event.metaKey) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }
    const key = event.key.toLowerCase()
    if (key === 's') {
      event.preventDefault()
      save()
    } else if (key === 'n') {
      event.preventDefault()
      store.openEditor('new')
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title">编辑笔记</h1>
      <p class="page__subtitle">内容会实时保存，离开页面时也会自动保存草稿。</p>
    </div>

    <EditorToolbar
      :title="title"
      :content="content"
      :saving="saving"
      @update:title="onTitle"
      @update:content="onContent"
      @save="onSave"
      @cancel="onCancel"
    />

    <div class="page__actions">
      <button type="button" class="btn btn--ghost" @click="onCancel">返回列表</button>
      <button v-if="isEdit" type="button" class="btn btn--danger" @click="requestDelete">删除笔记</button>
    </div>

    <ConfirmDialog
      :open="showDeleteConfirm"
      title="删除笔记"
      :message="`确定删除当前正在编辑的笔记吗？此操作不可撤销。`"
      confirm-text="确认删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
