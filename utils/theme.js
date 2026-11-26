/**
 * 主题与分享签名文案的统一存储读写（统一状态，AC-2 持久保留）
 * 主题与签名同存于一个存储键 noteThemePreference，保证同源持久化。
 */

const STORAGE_KEY = 'noteThemePreference'
const DEFAULT_THEME = 'light'
const THEMES = ['light', 'dark']

function getPreference() {
  return wx.getStorageSync(STORAGE_KEY) || {}
}

// 读取当前主题，无记录时回退默认主题
function getTheme() {
  const theme = getPreference().theme
  return THEMES.indexOf(theme) >= 0 ? theme : DEFAULT_THEME
}

// 设置主题并持久化
function setTheme(theme) {
  if (THEMES.indexOf(theme) < 0) {
    return false
  }
  const pref = getPreference()
  pref.theme = theme
  pref.updatedAt = Date.now()
  wx.setStorageSync(STORAGE_KEY, pref)
  return true
}

// 读取用户自定义签名文案
function getSignature() {
  return getPreference().signature || ''
}

// 设置自定义签名文案并持久化（随分享携带，AC-4）
function setSignature(signature) {
  const pref = getPreference()
  pref.signature = String(signature || '')
  pref.updatedAt = Date.now()
  wx.setStorageSync(STORAGE_KEY, pref)
  return pref.signature
}

module.exports = {
  DEFAULT_THEME,
  THEMES,
  getTheme,
  setTheme,
  getSignature,
  setSignature
}
