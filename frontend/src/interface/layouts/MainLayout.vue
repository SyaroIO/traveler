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
    <el-header><Header /></el-header>
    <el-main>
      <ClearLayout :component="component" />
    </el-main>
    <el-footer><Footer /></el-footer>
  </el-container>
</template>