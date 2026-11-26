/**
 * 笔记详情页：查看笔记，支持分享到微信朋友圈（自定义签名）
 * - 朋友圈分享走微信平台 onShareTimeline 通道（右上角「分享到朋友圈」菜单触发），
 *   自定义签名经分享卡片标题传递（AC-3/AC-4）。该通道无法用普通按钮直接触发，
 *   故提供带 open-type="share" 的「转发给好友」按钮作为可触发的分享通道。
 */
const { findNote } = require('../utils/notes.js')
const { getSignature } = require('../utils/theme.js')

Page({
  data: {
    note: null
  },

  onLoad(options) {
    const app = getApp()
    // 从统一数据源 app.globalData.notes 按 id 读取（与列表页写入一致，AC-5）
    const note = findNote(options.id)
    this.setData({ note })
    // 每个页面进入时兜底应用当前全局主题（AC-1/AC-2）
    getApp().applyTheme()
  },

  // 微信朋友圈分享通道：携带自定义签名到朋友圈分享卡片（AC-3/AC-4）
  // 朋友圈分享由微信平台右上角「分享到朋友圈」菜单触发，依赖本回调，无法用普通按钮直接触发
  onShareTimeline() {
    const note = this.data.note
    if (!note) {
      return
    }
    const signature = (getSignature() || '').trim()
    return {
      title: signature ? `${note.title} —— ${signature}` : note.title,
      query: `id=${note.id}`
    }
  },

  // 好友/会话转发通道：open-type="share" 由微信平台自动触发本回调，签名随转发携带（AC-4）
  onShareAppMessage() {
    const note = this.data.note
    if (!note) {
      return
    }
    const signature = (getSignature() || '').trim()
    return {
      title: signature ? `${note.title} —— ${signature}` : note.title,
      path: `/pages/detail/detail?id=${note.id}`
    }
  }
})
