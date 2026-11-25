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
    getApp().updateTheme(this.data.theme)
  },

  onSignatureInput(e) {
    this.setData({ signature: e.detail.value })
  },

  saveSignature() {
    setSignature(this.data.signature)
    this.loadSettings()
    wx.showToast({ title: '签名已保存', icon: 'success' })
  },

  resetSignature() {
    this.setData({ signature: '' })
    setSignature('')
    this.loadSettings()
  }
})
