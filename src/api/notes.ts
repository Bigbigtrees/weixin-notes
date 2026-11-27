import type { Note, NotePatch, NoteSummary } from '../types/notes'

const STORAGE_KEY = 'weixin-notes:notes:v1'

function nowISO(): string {
  return new Date().toISOString()
}

function seedNotes(): Note[] {
  const t = nowISO()
  const base = t
  return [
    {
      id: 'note-seed-1',
      title: '产品需求复盘',
      content: '整理近期需求迭代，梳理优先级、待确认项与验收标准，为后续前端实现提供依据。',
      category: '工作',
      createdAt: base,
      updatedAt: base,
    },
    {
      id: 'note-seed-2',
      title: '前端可访问性笔记',
      content: '记录键盘可达、焦点可见、读屏可读与文本对比度达标的关键实现要点。',
      category: '学习',
      createdAt: base,
      updatedAt: base,
    },
    {
      id: 'note-seed-3',
      title: '本周计划',
      content: '完成前端页面与交互重构，按验收标准完成多断点与边界尺寸适配。',
      category: '工作',
      createdAt: base,
      updatedAt: base,
    },
  ]
}

function persistNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // 本地存储不可用时降级为内存存储，保证页面功能可用
  }
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Note[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore storage errors
  }
  return seedNotes()
}

function toSummary(note: Note): NoteSummary {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    category: note.category,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  }
}

let notes: Note[] = loadNotes()

export const notesApi = {
  list(): NoteSummary[] {
    return notes.map(toSummary)
  },
  get(id: string): NoteSummary | undefined {
    const note = notes.find((n) => n.id === id)
    return note ? toSummary(note) : undefined
  },
  create(
    title: string,
    content: string,
    category: Note['category'] = '工作',
  ): Note {
    const note: Note = {
      id: newId(),
      title: title.trim() || '未命名笔记',
      content: content,
      category,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    notes = [...notes, note]
    persistNotes(notes)
    return note
  },
  update(id: string, patch: NotePatch): Note | undefined {
    const index = notes.findIndex((n) => n.id === id)
    if (index === -1) return undefined
    const note = notes[index]
    Object.assign(note, patch)
    note.updatedAt = nowISO()
    notes = notes.map((n) => (n.id === id ? note : n))
    persistNotes(notes)
    return note
  },
  remove(id: string): boolean {
    const index = notes.findIndex((n) => n.id === id)
    if (index === -1) return false
    notes = notes.filter((n) => n.id !== id)
    persistNotes(notes)
    return true
  },
  clearAll(): void {
    notes = []
    persistNotes(notes)
  },
  resetToSample(): void {
    notes = seedNotes()
    persistNotes(notes)
  },
}

export function seedNotesForTest(): Note[] {
  return seedNotes()
}

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
