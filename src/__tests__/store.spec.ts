import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '../stores/notes'

describe('notes store / 本地数据层（后端范围外）', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useNotesStore()
    store.restoreSampleNotes()
  })

  it('首次初始化时提供示例笔记', () => {
    const store = useNotesStore()
    store.init()
    expect(store.notes.length).toBeGreaterThan(0)
  })

  it('支持创建、更新、删除与搜索筛选', () => {
    const store = useNotesStore()
    store.init()

    const created = store.createNote('测试笔记', '这是测试内容', '学习')
    expect(store.notes.some((n) => n.id === created.id)).toBe(true)

    const updated = store.updateNote(created.id, { content: '更新后的内容' })
    expect(updated?.content).toBe('更新后的内容')

    store.setFilter('学习')
    expect(store.filteredNotes.every((n) => n.category === '学习')).toBe(true)

    store.setQuery('测试')
    expect(store.filteredNotes.length).toBe(1)

    expect(store.removeNote(created.id)).toBe(true)
    expect(store.notes.some((n) => n.id === created.id)).toBe(false)
  })

  it('删除采用二次确认：确认后执行删除，未确认不删除', () => {
    const store = useNotesStore()
    store.init()
    const id = store.notes[0].id

    store.requestDelete(id)
    expect(store.deleteTarget).toBe(id)

    store.confirmDelete()
    expect(store.notes.some((n) => n.id === id)).toBe(false)
    store.clearDeleteTarget()
    expect(store.deleteTarget).toBe('')
  })
})
