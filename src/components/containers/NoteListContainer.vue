<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useNotesStore } from '../../stores/notes'
import NoteList from '../note/NoteList.vue'

const store = useNotesStore()
const router = useRouter()

function onEdit(id: string): void {
  store.openEditor(id)
}

function onOpen(id: string): void {
  void router.push(`/notes/${id}`)
}

function onDelete(id: string): void {
  store.requestDelete(id)
}
</script>

<template>
  <NoteList
    :notes="store.notes"
    :query="store.query"
    :filter="store.filter"
    @search="store.setQuery"
    @filter="store.setFilter"
    @edit="onEdit"
    @delete="onDelete"
    @open="onOpen"
  />
</template>
