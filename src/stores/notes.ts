import { defineStore } from 'pinia'
import { notesApi } from '../api/notes'
import type { Note, NotePatch, NoteSummary } from '../types/notes'

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as NoteSummary[],
    query: '' as string,
    filter: '全部' as NoteSummary['category'] | '全部',
    selectedId: '' as string,
    draftTitle: '' as string,
    draftContent: '' as string,
    deleteTarget: '' as string,
  }),
  getters: {
    filteredNotes(state): NoteSummary[] {
      const q = state.query.trim().toLowerCase()
      return state.notes
        .filter((n) => (state.filter === '全部' || n.category === state.filter))
        .filter((n) => {
          if (!q) return true
          return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
        })
    },
    hasNotes(state): boolean {
      return state.notes.length > 0
    },
  },
  actions: {
    init(): void {
      this.reloadNotes()
    },
    reloadNotes(): void {
      this.notes = notesApi.list()
    },
    setQuery(query: string): void {
      this.query = query
    },
    setFilter(filter: NoteSummary['category'] | '全部'): void {
      this.filter = filter
    },
    openNote(id: string): void {
      this.selectedId = id
    },
    openEditor(id?: string): void {
      this.selectedId = id ?? 'new'
      const note = id && id !== 'new' ? notesApi.get(id) : undefined
      this.draftTitle = note?.title ?? ''
      this.draftContent = note?.content ?? ''
    },
    createNote(
      title: string,
      content: string,
      category: Note['category'] = '工作',
    ): Note {
      const note = notesApi.create(title, content, category)
      this.reloadNotes()
      return note
    },
    updateNote(id: string, patch: NotePatch): Note | undefined {
      const note = notesApi.update(id, patch)
      if (note) this.reloadNotes()
      return note
    },
    removeNote(id: string): boolean {
      const ok = notesApi.remove(id)
      if (ok) this.reloadNotes()
      return ok
    },
    requestDelete(id: string): void {
      this.deleteTarget = id
    },
    clearAll(): void {
      notesApi.clearAll()
      this.reloadNotes()
    },
    confirmDelete(): boolean {
      const id = this.deleteTarget
      this.deleteTarget = ''
      if (id) this.removeNote(id)
      return true
    },
    clearDeleteTarget(): void {
      this.deleteTarget = ''
    },
    restoreSampleNotes(): void {
      notesApi.resetToSample()
      this.notes = notesApi.list()
      this.query = ''
      this.filter = '全部'
    },
  },
})
