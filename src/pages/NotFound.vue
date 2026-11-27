<script setup lang="ts">
</script>

<template>
  <div class="not-found">
    <p class="not-found__code" aria-label="页面未找到">404</p>
    <h1 class="not-found__title">页面不存在</h1>
    <p class="not-found__hint">该页面不存在或已被移动。</p>
    <RouterLink to="/" class="btn btn--primary">返回首页</RouterLink>
  </div>
</template>
