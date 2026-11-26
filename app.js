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
    // 同步系统导航栏/背景到当前主题（各页面再通过根节点 data-theme 应用内容主题，AC-1/AC-6）
    this.syncSystemUI(this.globalData.theme)
  },

  // 切换全局主题并同步系统界面；页面进入时按 globalData.theme 应用根节点主题（即时生效，AC-1）
  updateTheme(theme) {
    if (THEMES.indexOf(theme) < 0) {
      return false
    }
    this.globalData.theme = theme
    this.syncSystemUI(theme)
    return true
  },

  // 导航栏与窗口背景随主题切换，保证各主题下整体观感与对比度一致（AC-6）
  syncSystemUI(theme) {
    try {
      const dark = theme === 'dark'
      wx.setNavigationBarColor({
        frontColor: dark ? '#ffffff' : '#000000',
        backgroundColor: dark ? '#171717' : '#ffffff'
      })
      wx.setBackgroundColor({ backgroundColor: dark ? '#171717' : '#f5f6f8' })
    } catch (e) {
      // 系统界面接口不可用时忽略，不影响页面内主题与核心流程
    }
  }
})
