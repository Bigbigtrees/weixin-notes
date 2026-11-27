<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'
import ToastHost from './components/ToastHost.vue'
</script>

<template>
  <div class="app">
    <Header />
    <main class="container">
      <RouterView />
    </main>
    <Sidebar />
    <Footer />
    <ToastHost />
  </div>
</template>
