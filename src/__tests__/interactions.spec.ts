import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../App.vue'
import Home from '../pages/Home.vue'
import Editor from '../pages/Editor.vue'
import Settings from '../pages/Settings.vue'
import NotFound from '../pages/NotFound.vue'
import { useNotesStore } from '../stores/notes'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/editor', component: Editor },
      { path: '/editor/:id', component: Editor },
      { path: '/settings', component: Settings },
      { path: '/notes/:id', component: () => import('../pages/NoteDetail.vue') },
      { path: '/:pathMatch(.*)*', component: NotFound },
    ],
  })
}

async function setInputValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

async function mountApp(path: string) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useNotesStore()
  store.restoreSampleNotes()
  const router = createTestRouter()
  await router.push(path)
  await router.isReady()
  const wrapper = mount(App, {
    global: { plugins: [pinia, router] },
    attachTo: document.body,
  })
  await flushPromises()
  return { wrapper, router, store }
}

describe('AC-I1 页面主要交互（列表搜索筛选 / 编辑导航 / 自动保存）', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('首页搜索可按标题/内容过滤笔记列表', async () => {
    await mountApp('/')

    expect(document.querySelectorAll('[data-note-id]').length).toBeGreaterThan(0)

    const search = document.querySelector<HTMLInputElement>('#note-search-input')
    expect(search).toBeTruthy()
    await setInputValue(search!, '可访问性')
    await flushPromises()

    const visible = Array.from(document.querySelectorAll('[data-note-id]'))
    expect(visible.length).toBe(1)
    expect(visible[0].textContent).toContain('前端可访问性笔记')

    await setInputValue(search!, '')
    await flushPromises()
    expect(document.querySelectorAll('[data-note-id]').length).toBe(3)
  })

  it('类型筛选下拉可按分类过滤笔记列表', async () => {
    await mountApp('/')

    const filter = document.querySelector<HTMLSelectElement>('#note-filter-input')
    expect(filter).toBeTruthy()

    filter!.value = '学习'
    filter!.dispatchEvent(new Event('change', { bubbles: true }))
    await flushPromises()

    const visible = Array.from(document.querySelectorAll('[data-note-id]'))
    expect(visible.length).toBe(1)
    expect(visible[0].textContent).toContain('前端可访问性笔记')

    filter!.value = '全部'
    filter!.dispatchEvent(new Event('change', { bubbles: true }))
    await flushPromises()
    expect(document.querySelectorAll('[data-note-id]').length).toBe(3)
  })

  it('点击卡片「编辑」进入编辑器并载入该笔记内容', async () => {
    const { router } = await mountApp('/')

    const editButton = Array.from(document.querySelectorAll('button')).find((b) =>
      b.getAttribute('aria-label')?.includes('编辑笔记'),
    )
    expect(editButton).toBeTruthy()
    editButton!.click()
    await flushPromises()

    expect(router.currentRoute.value.path).toMatch(/^\/editor\//)
    const titleInput = document.querySelector<HTMLInputElement>('input[aria-label="笔记标题"]')
    expect(titleInput?.value).toContain('产品需求复盘')
  })

  it('直接访问 /editor/:id 深链也能载入该笔记内容', async () => {
    const { router } = await mountApp('/editor/note-seed-2')

    expect(router.currentRoute.value.path).toBe('/editor/note-seed-2')
    const titleInput = document.querySelector<HTMLInputElement>('input[aria-label="笔记标题"]')
    expect(titleInput?.value).toContain('前端可访问性笔记')
  })

  it('空状态「新建笔记」进入编辑器', async () => {
    const { router, store } = await mountApp('/')
    store.clearAll()
    await flushPromises()

    const newButton = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '新建笔记',
    )
    expect(newButton).toBeTruthy()
    newButton!.click()
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/editor')
  })

  it('编辑器保存一次只创建一条笔记，防抖后不重复创建', async () => {
    vi.useFakeTimers()
    const { router, store } = await mountApp('/')
    store.openEditor('new')
    await router.push('/editor')
    await flushPromises()

    const inputs = document.querySelectorAll('input, textarea')
    const titleInput = Array.from(inputs).find(
      (el) => el.getAttribute('aria-label') === '笔记标题',
    ) as HTMLInputElement
    const contentInput = Array.from(inputs).find(
      (el) => el.getAttribute('aria-label') === '笔记内容',
    ) as HTMLTextAreaElement
    expect(titleInput).toBeTruthy()
    expect(contentInput).toBeTruthy()

    const before = store.notes.length
    await setInputValue(titleInput, '自动化测试笔记')
    await setInputValue(contentInput, '这是自动化测试内容')
    await flushPromises()

    const saveButton = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === '保存',
    )
    expect(saveButton).toBeTruthy()
    saveButton!.click()
    await flushPromises()

    expect(store.notes.length).toBe(before + 1)

    await vi.advanceTimersByTimeAsync(2000 * 5)
    await flushPromises()

    expect(store.notes.length).toBe(before + 1)
  })
})
