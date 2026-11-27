import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

// 使用 reactive 包装，使 push/remove 对 toasts 的变更触发 v-for 重渲染
// （模块级普通数组不做副作用追踪，会导致 Toast 不更新、aria-live 播报失效）。
export const toasts = reactive<ToastItem[]>([])
let nextId = 1

export function pushToast(message: string, type: ToastType = 'info'): number {
  const id = nextId++
  toasts.push({ id, message, type })
  if (typeof setTimeout === 'function') {
    setTimeout(() => removeToast(id), 3000)
  }
  return id
}

export function removeToast(id: number): void {
  const index = toasts.findIndex((t) => t.id === id)
  if (index >= 0) toasts.splice(index, 1)
}

export function useToast(): { toasts: ToastItem[]; show: (message: string, type?: ToastType) => void } {
  function show(message: string, type: ToastType = 'info'): void {
    pushToast(message, type)
  }
  return { toasts, show }
}
