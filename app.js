/**
 * 记笔记小程序 App 入口
 * 维护全局主题与签名偏好（统一状态，通过 utils/theme.js 读写持久化）
 */
const { THEMES } = require('./utils/theme.js')

App({
  globalData: {
    theme: 'light',
    signature: '',
    notes: []
  },

  onLaunch() {
    // 启动时从存储恢复主题与签名，保证持久保留（AC-2）
    const pref = wx.getStorageSync('noteThemePreference') || {}
    if (THEMES.indexOf(pref.theme) >= 0) {
      this.globalData.theme = pref.theme
    }
    if (typeof pref.signature === 'string') {
      this.globalData.signature = pref.signature
    }
    this.applyTheme()
  },

  // 切换全局主题：通过 page 属性即时应用主题变量，无异步延迟（AC-1）
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
