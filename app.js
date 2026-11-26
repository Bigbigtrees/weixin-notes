/**
 * 记笔记小程序 App 入口
 * 维护全局主题与签名偏好（统一状态，通过 utils/theme.js 读写持久化）
 */
const { THEMES } = require('./utils/theme.js')
const { loadNotes } = require('./utils/notes.js')

App({
  globalData: {
    theme: 'light',
    signature: '',
    notes: []
  },

  onLaunch() {
    // 启动时从存储恢复主题与签名（持久保留，AC-2）
    const pref = wx.getStorageSync('noteThemePreference') || {}
    if (THEMES.indexOf(pref.theme) >= 0) {
      this.globalData.theme = pref.theme
    }
    if (typeof pref.signature === 'string') {
      this.globalData.signature = pref.signature
    }
    // 恢复笔记（持久化，重启后不丢失，M-1）
    this.globalData.notes = loadNotes()
    this.applyTheme()
  },

  // 切换全局主题：通过页面属性即时应用主题变量，切换后界面即时生效（AC-1）
  // 注：wx.setPageAttribute 通过页面属性切换主题变量，切换后呈现延迟极小
  applyTheme() {
    wx.setPageAttribute({
      selector: 'page',
      data: { 'data-theme': this.globalData.theme }
    })
  },

  // 主题更新后刷新全局状态
  updateTheme(theme) {
    this.globalData.theme = theme
    this.applyTheme()
  }
})
