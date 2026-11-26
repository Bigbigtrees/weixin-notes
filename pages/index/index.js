/**
 * 记笔记列表页（核心流程：新增/查看/删除笔记）
 * 本页不引入主题与分享逻辑（主题与分享在设置页/详情页处理），保证核心流程无回归（AC-5）。
 * 笔记通过 utils/notes.js 统一读写 app.globalData.notes，保证与详情页数据一致。
 */
const { addNote, removeNote } = require('../utils/notes.js')

Page({
  data: {
    notes: [],
    noteTitle: ''
  },

  onShow() {
    this.loadNotes()
    // 每个页面进入时兜底应用当前全局主题（AC-1/AC-2，确保跨页面主题即时生效）
    getApp().applyTheme()
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
    this.setData({ noteTitle: '' })
    wx.showToast({ title: '已添加', icon: 'success' })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },

  deleteNote(e) {
    const id = e.currentTarget.dataset.id
    removeNote(id)
    this.loadNotes()
  }
})
