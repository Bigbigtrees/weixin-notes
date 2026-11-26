/**
 * 记笔记列表页（核心流程：新增/查看/删除笔记）
 * 主题通过根节点 data-theme 应用，签名与分享在设置页/详情页处理，保证核心流程无回归（AC-5）。
 * 笔记通过 utils/notes.js 统一读写 app.globalData.notes，保证与详情页数据一致。
 */
const { addNote, removeNote } = require('../../utils/notes.js')

Page({
  data: {
    notes: [],
    noteTitle: '',
    theme: 'light'
  },

  onShow() {
    this.loadNotes()
    // 每个页面进入时按全局主题应用根节点 data-theme（即时生效，AC-1/AC-2）
    this.setData({ theme: getApp().globalData.theme })
  },

  // 从全局数据源加载笔记（M-1：真实加载而非无效 setData）
  loadNotes() {
    this.setData({ notes: (getApp().globalData.notes || []).slice() })
  },

  // 输入框仅更新输入草稿，不创建笔记（避免每字符建一条、避免点击空白抛异常）
  onInput(e) {
    this.setData({ noteTitle: e.detail.value })
  },

  // 保存按钮：校验标题并创建一条笔记
  addNote() {
    const title = this.data.noteTitle.trim()
    if (!title) {
      wx.showToast({ title: '请输入笔记标题', icon: 'none' })
      return
    }
    addNote(title)
    // 新增后刷新页面展示列表（统一数据源已写入，此处同步展示数据，保证列表即时显示新笔记，AC-5）
    this.loadNotes()
    this.setData({ noteTitle: '' })
    wx.showToast({ title: '已添加', icon: 'success' })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  deleteNote(e) {
    const id = e.currentTarget.dataset.id
    removeNote(id)
    this.loadNotes()
  }
})
