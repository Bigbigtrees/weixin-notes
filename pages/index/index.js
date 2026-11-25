/**
 * 记笔记列表页（核心流程：新增/查看笔记）
 * 本页不引入主题与分享逻辑，保证核心流程无回归（AC-5）
 */
Page({
  data: {
    notes: []
  },

  onShow() {
    this.loadNotes()
  },

  loadNotes() {
    this.setData({ notes: this.data.notes })
  },

  addNote(e) {
    const title = e.detail.value.trim()
    if (!title) {
      wx.showToast({ title: '请输入笔记标题', icon: 'none' })
      return
    }
    const note = { id: Date.now(), title, createdAt: Date.now() }
    this.setData({ notes: [note].concat(this.data.notes) })
    wx.showToast({ title: '已添加', icon: 'success' })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  },

  deleteNote(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      notes: this.data.notes.filter((n) => n.id !== id)
    })
  }
})
