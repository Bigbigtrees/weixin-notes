import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { toasts, pushToast, removeToast } from '../composables/useToast'
import ToastHost from '../components/ToastHost.vue'

describe('Toast 反馈响应式渲染（修复 D1：toasts 需响应式以触发 v-for 重渲染）', () => {
  beforeEach(() => {
    // toasts 为模块级 reactive 数组，清空以保证测试隔离
    toasts.length = 0
  })

  it('pushToast 后 ToastHost 渲染对应提示（响应式更新）', async () => {
    const wrapper = mount(ToastHost)
    expect(wrapper.findAll('.toast').length).toBe(0)

    pushToast('保存成功', 'success')
    await flushPromises()

    const toast = wrapper.findAll('.toast')[0]
    expect(toast.text()).toBe('保存成功')
  })

  it('removeToast 后 Toast 从 DOM 移除（响应式更新）', async () => {
    const id = pushToast('临时提示', 'info')
    await flushPromises()
    const wrapper = mount(ToastHost)

    expect(wrapper.findAll('.toast').length).toBe(1)

    removeToast(id)
    await flushPromises()
    expect(wrapper.findAll('.toast').length).toBe(0)
  })
})
