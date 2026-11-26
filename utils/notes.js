/**
 * 笔记的统一存储读写（统一数据源，AC-5 无回归）
 * 笔记的唯一数据源为 app.globalData.notes，写入与读取均收敛到此工具，
 * 保证列表页（新增/删除）与详情页（按 id 查看）读写两端一致，避免数据流断裂。
 * 同时持久化到 wx 存储，小程序重启后不丢失（M-1）。
 */

const NOTES_KEY = 'noteNotes'

// 从存储读取笔记（供 App 启动恢复）
function loadNotes() {
  return wx.getStorageSync(NOTES_KEY) || []
}

// 将笔记写入存储并同步到全局数据源
function persistNotes(notes) {
  wx.setStorageSync(NOTES_KEY, notes)
}

// 生成唯一笔记 id：Date.now() + 递增序号，避免同毫秒新增导致 id 重复（wx:key 重复告警、findNote 命中歧义）
let noteSeq = 0
function createNoteId() {
  noteSeq += 1
  return Date.now() + noteSeq
}

// 新增一条笔记（写入全局数据源并持久化）
function addNote(title) {
  const app = getApp()
  const notes = app.globalData.notes || []
  const note = { id: createNoteId(), title, createdAt: Date.now() }
  const next = [note].concat(notes)
  app.globalData.notes = next
  persistNotes(next)
  return note
}

// 删除一条笔记（从全局数据源移除并持久化）
function removeNote(id) {
  const app = getApp()
  const notes = (app.globalData.notes || []).filter((n) => String(n.id) !== String(id))
  app.globalData.notes = notes
  persistNotes(notes)
  return notes
}

// 按 id 查找笔记（详情页读取端与列表页数据源一致）
function findNote(id) {
  const app = getApp()
  const notes = app.globalData.notes || []
  return notes.find((n) => String(n.id) === String(id))
}

module.exports = {
  loadNotes,
  persistNotes,
  addNote,
  removeNote,
  findNote
}
