<script setup lang="ts">
import { icons } from '../ui/icons'

const navLinks = [
  { to: '/', label: '首页', icon: 'home' },
  { to: '/editor', label: '新建', icon: 'newNote' },
  { to: '/settings', label: '设置', icon: 'settings' },
]

function iconMarkup(icon: string): string {
  return icons[icon] ?? ''
}
</script>

<template>
  <div class="sidebar">
    <nav class="sidebar__desktop" aria-label="主导航">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :aria-current="link.to === '/' ? 'page' : undefined"
      >
        <span class="nav-link__icon" aria-hidden="true" v-html="iconMarkup(link.icon)"></span>
        <span class="nav-link__label">{{ link.label }}</span>
      </RouterLink>
    </nav>

    <nav class="sidebar__mobile" aria-label="底部导航">
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="bottom-nav-link"
        :aria-label="link.label + '导航'"
        :aria-current="link.to === '/' ? 'page' : undefined"
      >
        <span class="bottom-nav-link__icon" aria-hidden="true" v-html="iconMarkup(link.icon)"></span>
        <span class="bottom-nav-link__label">{{ link.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>
