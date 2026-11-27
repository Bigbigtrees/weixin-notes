export interface Note {
  id: string
  title: string
  content: string
  category: NoteCategory
  createdAt: string
  updatedAt: string
}

export type NoteCategory = '工作' | '生活' | '学习'

export interface NotePatch {
  title?: string
  content?: string
  category?: NoteCategory
}

export interface NoteSummary {
  id: string
  title: string
  content: string
  category: NoteCategory
  createdAt: string
  updatedAt: string
}

export type ListNotesResult = NoteSummary[]
