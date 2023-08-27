<script lang="ts" setup>
import Header from './components/HeaderComponent.vue'
import Footer from './components/FooterComponent.vue'
import ClearLayout from './ClearLayout.vue'
import type { Component } from 'vue'
defineProps<{
  component: () => Promise<Component>
}>()
</script>

<template>
  <el-container style="min-height: 100vh;">
    <el-container>
      <el-header><Header /></el-header>
      <el-main>
        <ClearLayout :component="component" />
      </el-main>
      <el-footer><Footer /></el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
  width: auto;
}
</style>