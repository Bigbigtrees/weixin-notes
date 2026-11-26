/**
 * 设置页：主题修改（主题切换）与自定义签名设置
 * 主题切换即时生效并持久保留（AC-1/AC-2）；签名随分享携带（AC-4）
 */
const { setTheme, getTheme, getSignature, setSignature } = require('../../utils/theme.js')

Page({
  data: {
    theme: 'light',
    signature: '',
    themeList: ['light', 'dark']
  },

  onShow() {
    this.loadSettings()
    // 进入设置页时应用当前全局主题（wx.setPageAttribute 作用于当前页，跨页面不保留属性，
    // 防止全局为 dark 时设置页恒呈浅色，AC-1/AC-2）
    getApp().applyTheme()
  },

  loadSettings() {
    const app = getApp()
    this.setData({
      theme: getTheme(),
      signature: getSignature()
    })
  },

  // 切换主题：即时应用主题变量 + 持久化存储，重启/返回后保持（AC-1/AC-2）
  switchTheme(e) {
    const theme = e.currentTarget.dataset.theme
    if (theme === this.data.theme) {
      return
    }
    setTheme(theme)
    this.setData({ theme }) // 同步页面选中态
    getApp().updateTheme(theme) // 传入新主题，即时应用（修正旧主题传入导致切换不生效）
  },

  onSignatureInput(e) {
    this.setData({ signature: e.detail.value })
  },

  saveSignature() {
    const signature = this.data.signature
    setSignature(signature)
    // 同步全局状态，保证后续分享读取端（详情页等）拿到新设置的签名，读写两端数据源一致（B-7）
    getApp().globalData.signature = signature
    this.loadSettings()
    wx.showToast({ title: '签名已保存', icon: 'success' })
  },

  resetSignature() {
    getApp().globalData.signature = ''
    this.setData({ signature: '' })
    setSignature('')
    this.loadSettings()
  }
})
