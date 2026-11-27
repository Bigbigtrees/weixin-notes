import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import NoteDetail from '../pages/NoteDetail.vue'
import EditorContainer from '../components/containers/EditorContainer.vue'
import SettingsContainer from '../components/containers/SettingsContainer.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: Home, meta: { title: 'weixin-notes 首页' } },
  { path: '/notes/:id', name: 'note-detail', component: NoteDetail, meta: { title: '笔记详情' } },
  { path: '/editor', name: 'editor', component: EditorContainer, meta: { title: '编辑笔记' } },
  { path: '/settings', name: 'settings', component: SettingsContainer, meta: { title: '设置' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: '页面未找到' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? 'weixin-notes'
})

export default router
