<script setup lang="ts">
import { ref } from 'vue'
import { useNotesStore } from '../stores/notes'
import { useToast } from '../composables/useToast'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import Card from '../components/ui/Card.vue'

const store = useNotesStore()
const toast = useToast()
store.init()

const showClear = ref(false)
const showRestore = ref(false)

function doClear(): void {
  store.clearAll()
  toast.show('已清空本地笔记', 'info')
  showClear.value = false
}

function doRestore(): void {
  store.restoreSampleNotes()
  toast.show('已恢复示例笔记', 'success')
  showClear.value = false
  showRestore.value = false
}
</script>

<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title">设置</h1>
      <p class="page__subtitle">管理本地笔记数据，操作均有二次确认。</p>
    </div>

    <div class="settings">
      <Card>
        <p class="settings__hint">当前保存的笔记存储在浏览器本地存储中，清空后不可恢复（可随时从示例恢复）。</p>
        <div class="settings__actions">
          <button type="button" class="btn btn--secondary" @click="showClear = true">清空本地笔记</button>
          <button type="button" class="btn btn--secondary" @click="showRestore = true">恢复示例笔记</button>
        </div>
      </Card>
    </div>

    <ConfirmDialog
      :open="showClear"
      title="清空本地笔记"
      message="确定清空当前所有本地笔记吗？此操作不可撤销。"
      confirm-text="确认清空"
      cancel-text="取消"
      @confirm="doClear"
      @cancel="showClear = false"
    />
    <ConfirmDialog
      :open="showRestore"
      title="恢复示例笔记"
      message="确定用示例笔记替换当前本地笔记吗？"
      confirm-text="确认恢复"
      cancel-text="取消"
      @confirm="doRestore"
      @cancel="showRestore = false"
    />
  </div>
</template>
