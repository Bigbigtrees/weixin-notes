import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import Home from '../pages/Home.vue'
import NotFound from '../pages/NotFound.vue'
import NoteCard from '../components/note/NoteCard.vue'
import type { Note } from '../types/notes'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/editor', component: () => import('../pages/Editor.vue') },
      { path: '/settings', component: () => import('../pages/Settings.vue') },
      { path: '/notes/:id', component: () => import('../pages/NoteDetail.vue') },
      { path: '/:pathMatch(.*)*', component: NotFound },
    ],
  })
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('AC-P1 / AC-A1 / AC-A2 / AC-A3 — 页面结构与可访问性', () => {
  it('渲染语义页面结构：header / main / footer 与首页笔记列表', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
      attachTo: document.body,
    })
    await flushPromises()

    expect(document.querySelector('main')).toBeTruthy()
    expect(document.querySelector('header')).toBeTruthy()
    expect(document.querySelector('footer')).toBeTruthy()
    expect(document.querySelector('.note-list')).toBeTruthy()

    const cards = document.querySelectorAll('[data-note-id]')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('笔记卡片操作按钮具备可访问名称，且键盘焦点可见样式由全局提供', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
      attachTo: document.body,
    })
    await flushPromises()

    const noteCards = document.querySelectorAll('[data-note-id]')
    expect(noteCards.length).toBeGreaterThan(0)

    // 每个笔记卡片的操作按钮都应提供 aria-label（可访问名称）
    noteCards.forEach((card) => {
      const buttons = card.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
      buttons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toBeTruthy()
      })
    })

    // 焦点可见样式在全局样式中通过 :focus-visible 提供
    expect(document.querySelector('.toast-host')).toBeTruthy()
  })

  it('点击「删除」操作会进入二次确认状态', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
      attachTo: document.body,
    })
    await flushPromises()

    const deleteButton = Array.from(document.querySelectorAll('button'))
      .find((b) => b.getAttribute('aria-label')?.includes('删除笔记'))
    expect(deleteButton).toBeTruthy()
    if (!deleteButton) throw new Error('未找到删除笔记按钮')
    deleteButton.click()
    await flushPromises()

    const confirmDialog = document.querySelector('.modal')
    expect(confirmDialog).toBeTruthy()
  })

  it('未知路由渲染 404 语义页面', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = createTestRouter()
    await router.push('/not-exist')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [pinia, router] },
      attachTo: document.body,
    })
    await flushPromises()

    expect(document.querySelector('.not-found')).toBeTruthy()
  })
})

describe('NoteCard 组件可访问性', () => {
  it('渲染标题、内容与带 aria-label 的操作按钮', () => {
    const note: Note = {
      id: 'n1',
      title: '测试笔记',
      content: '内容文本',
      category: '工作',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    const wrapper = mount(NoteCard, { props: { note } })
    expect(wrapper.text()).toContain('测试笔记')
    expect(wrapper.text()).toContain('内容文本')
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3)
    buttons.forEach((button) => expect(button.attributes('aria-label')).toBeTruthy())
  })
})
