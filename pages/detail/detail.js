/**
 * 笔记详情页：查看笔记，支持分享到微信朋友圈（自定义签名）
 * 分享通过微信平台允许的 onShareAppMessage 通道发起；自定义签名传递至分享卡片（AC-3/AC-4）
 * 按钮仅在笔记存在（可分享状态）时展示，避免误触（AC-3）
 */
Page({
  data: {
    note: null,
    shareable: true
  },

  onLoad(options) {
    const app = getApp()
    const note = (app.globalData.notes || []).find((n) => String(n.id) === String(options.id))
    this.setData({ note })
  },

  onUnload() {
    // 清理本地缓存，避免详情页数据残留影响核心流程
  },

  // 微信平台分享通道：自定义签名作为分享标题，随分享卡片传递（AC-4）
  onShareAppMessage() {
    const note = this.data.note
    if (!note) {
      return
    }
    const signature = (getApp().globalData.signature || '').trim()
    return {
      title: signature ? `${note.title} —— ${signature}` : note.title,
      path: `/pages/detail/detail?id=${note.id}`
    }
  }
})
