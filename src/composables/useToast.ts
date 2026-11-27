export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

export const toasts: ToastItem[] = []
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
